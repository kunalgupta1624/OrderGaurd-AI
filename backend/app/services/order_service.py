from app.services.prediction_service import RTOPredictionService
from app.services.customer_validator import CustomerValidator
from app.services.decision_engine import OrderDecisionEngine
from app.services.discount_calculator import PrepaidDiscountCalculator
from app.services.order_store import OrderStore

class OrderEvaluationService:


    def __init__(self):
        self.prediction_service = RTOPredictionService()
        self.customer_validator = CustomerValidator()
        self.decision_engine = OrderDecisionEngine()
        self.discount_calculator = PrepaidDiscountCalculator()
        self.order_store = OrderStore()

    def evaluate_order(self, order: dict):

        # 1. Predict RTO probability using trained ML model
        prediction = self.prediction_service.predict(order)

        probability = prediction["rto_probability"]

        # 2. Validate customer information
        validation_result = self.customer_validator.validate(
            name=order["customer_name"],
            address=order["address"],
            pincode=order["pincode"]
        )

        validation_summary = validation_result["validation_summary"]

        # 3. Determine recommended action
        decision = self.decision_engine.evaluate(
            rto_probability=probability,
            validation_summary=validation_summary
        )

        # 4. Calculate prepaid offer when required
        discount_result = None

        if decision["decision"] == "NUDGE_PREPAID":
            discount_result = self.discount_calculator.calculate(
                order_value=order["order_value"]
            )

        # 5. Prepare API response
        result = {
            "order_id": order["order_id"],
            "rto_probability": prediction["rto_probability"],
            "rto_percentage": prediction["rto_percentage"],
            "recommended_action": decision["decision"],
            "explanation": decision["reason"],
            "customer_validation": validation_result,
            "prepaid_offer": discount_result,
            "message": "Order evaluated successfully"
        }

        # 6. Save evaluation
        self.order_store.save_order({
            "order_id": order["order_id"],
            "customer_name": order["customer_name"],
            "order_value": order["order_value"],
            "rto_probability": prediction["rto_probability"],
            "recommended_action": decision["decision"],
            "explanation": decision["reason"],
            "validation_status": validation_summary["overall_status"],
            "prepaid_offer": discount_result
        })

        return result

