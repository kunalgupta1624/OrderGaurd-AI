from pathlib import Path

import joblib
import pandas as pd


# Locate the trained model
PROJECT_ROOT = Path(__file__).resolve().parents[3]

MODEL_PATH = PROJECT_ROOT / "models" / "random_forest.pkl"


class RTOPredictionService:

    def __init__(self):

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Trained model not found: {MODEL_PATH}"
            )

        self.model = joblib.load(MODEL_PATH)

        if not hasattr(self.model, "predict_proba"):
            raise ValueError(
                "Loaded model does not support probability prediction."
            )

        classes = list(self.model.classes_)

        if 1 not in classes:
            raise ValueError(
                "Model does not contain the RTO class (1)."
            )

        self.rto_class_index = classes.index(1)

        print("RTO prediction model loaded successfully.")

    @staticmethod
    def calculate_address_quality(address):

        if pd.isna(address):
            return 0

        address = str(address).strip().lower()

        if address in ["", ".", "unknown", "na", "null"]:
            return 0

        score = 0

        if len(address) >= 15:
            score += 30

        if any(char.isdigit() for char in address):
            score += 20

        location_keywords = [
            "road", "street", "nagar", "colony",
            "sector", "block", "apartment", "flat",
            "house", "near", "opposite", "mandir",
            "chowk", "village"
        ]

        if any(word in address for word in location_keywords):
            score += 30

        if len(address.split()) >= 4:
            score += 20

        return min(score, 100)

    @staticmethod
    def validate_name(name):

        if pd.isna(name):
            return 0

        name = str(name).strip().lower()

        suspicious_names = [
            "asdf", "test", "xyz",
            "qwerty", "abc", "unknown"
        ]

        if name in suspicious_names:
            return 0

        if len(name) < 3:
            return 0

        return 1

    @staticmethod
    def validate_pincode(pincode):

        if pd.isna(pincode):
            return 0

        pincode = str(pincode).strip()

        if pincode.endswith(".0"):
            pincode = pincode[:-2]

        return int(
            len(pincode) == 6
            and pincode.isdigit()
            and pincode[0] != "0"
        )

    def predict(self, order):

        order_datetime = pd.to_datetime(
            order["order_datetime"],
            errors="raise"
        )

        order_value = float(order["order_value"])
        num_items = int(order["num_items"])

        if num_items <= 0:
            raise ValueError("Number of items must be positive.")

        prior_orders = int(order["customer_prior_orders"])
        prior_rto = int(order["customer_prior_rto"])

        if prior_orders < 0 or prior_rto < 0:
            raise ValueError("Customer history cannot be negative.")

        if prior_rto > prior_orders:
            raise ValueError(
                "Previous RTO orders cannot exceed previous orders."
            )

        # Derived features matching the training notebook
        customer_rto_rate = (
            prior_rto / prior_orders
            if prior_orders > 0 else 0
        )

        customer_rto_rate = min(
            max(customer_rto_rate, 0), 1
        )

        customer_successful_orders = max(
            prior_orders - prior_rto, 0
        )

        address_quality_score = self.calculate_address_quality(
            order["address"]
        )

        name_valid = self.validate_name(
            order["customer_name"]
        )

        pincode_valid = self.validate_pincode(
            order["pincode"]
        )

        high_value_order = int(order_value >= 1000)

        value_per_item = order_value / num_items

        order_hour = order_datetime.hour
        order_weekday = order_datetime.day_of_week
        is_weekend = int(order_weekday >= 5)

        # Exact feature names and order from training notebook
        features = {
            "order_value": order_value,
            "num_items": num_items,
            "customer_prior_orders": prior_orders,
            "customer_prior_rto": prior_rto,
            "customer_rto_rate": customer_rto_rate,
            "customer_successful_orders": customer_successful_orders,
            "address_quality_score": address_quality_score,
            "name_valid": name_valid,
            "pincode_valid": pincode_valid,
            "high_value_order": high_value_order,
            "value_per_item": value_per_item,
            "order_hour": order_hour,
            "order_weekday": order_weekday,
            "is_weekend": is_weekend,
            "city": str(order["city"]).strip() or "UNKNOWN",
            "state": str(order["state"]).strip(),
            "courier": str(order["courier"]).strip(),
            "utm_source": str(order["utm_source"]).strip()
        }

        input_df = pd.DataFrame([features])

        probabilities = self.model.predict_proba(input_df)

        rto_probability = float(
            probabilities[0][self.rto_class_index]
        )

        return {
            "rto_probability": round(rto_probability, 4),
            "rto_percentage": round(rto_probability * 100, 2)
        }