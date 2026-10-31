from fastapi import APIRouter, HTTPException

from app.schemas.order import OrderRequest

from app.services.prediction_service import RTOPredictionService
from app.services.decision_engine import OrderDecisionEngine
from app.services.customer_validator import CustomerValidator
from app.services.discount_calculator import PrepaidDiscountCalculator


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


# Initialize services
prediction_service = RTOPredictionService()
decision_engine = OrderDecisionEngine()
customer_validator = CustomerValidator()
discount_calculator = PrepaidDiscountCalculator()


@router.post("/predict")
def predict_order(order: OrderRequest):

    try:
        # 1. Convert request into dictionary
        order_data = order.model_dump()

        # 2. Validate customer details
        validation_result = customer_validator.validate(
            name=order.customer_name,
            address=order.address,
            pincode=order.pincode
        )

        validation_summary = validation_result["validation_summary"]

        # 3. Predict RTO probability
        prediction = prediction_service.predict(order_data)

        probability = prediction["rto_probability"]

        # 4. Make final decision
        decision = decision_engine.evaluate(
            rto_probability=probability,
            validation_summary=validation_summary
        )

        # 5. Calculate prepaid discount if recommended
        discount_result = None

        if decision["decision"] == "NUDGE_PREPAID":
            discount_result = discount_calculator.calculate(
                order_value=order.order_value
            )

        # 6. Return complete evaluation
        return {
            "order_id": order.order_id,
            "rto_probability": round(probability, 4),
            "rto_percentage": round(probability * 100, 2),
            "recommended_action": decision["decision"],
            "explanation": decision["reason"],
            "customer_validation": validation_result,
            "prepaid_offer": discount_result,
            "message": "Order evaluated successfully"
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@router.get("/")
def get_order_history():
    try:
        from app.services.order_store import OrderStore

        order_store = OrderStore()
        orders = order_store.get_all_orders()

        return {
            "total_orders": len(orders),
            "orders": orders
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )   