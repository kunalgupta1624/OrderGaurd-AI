from dataclasses import dataclass
from app.services.settings_store import SettingsStore


@dataclass
class DecisionThresholds:
    confirm_threshold: float = 0.30
    prepaid_threshold: float = 0.50
    hold_threshold: float = 0.85


class OrderDecisionEngine:

    def __init__(self, thresholds=None):
        self.thresholds = thresholds or DecisionThresholds()
        self.settings_store = SettingsStore()

    def evaluate(self, rto_probability: float, validation_summary: dict):

        if not 0 <= rto_probability <= 1:
            raise ValueError("RTO probability must be between 0 and 1.")

        settings = self.settings_store.get_settings()

        confirm = settings["confirm_threshold"]
        prepaid = settings["prepaid_threshold"]
        hold = settings["hold_threshold"]

        if validation_summary is None:
            validation_summary = {}

        high_risk = validation_summary.get("high_risk_count", 0)
        medium_risk = validation_summary.get("medium_risk_count", 0)

        if high_risk >= 2:
            return {
                "decision": "HOLD_REVIEW",
                "risk_probability": rto_probability,
                "reason": "Multiple critical customer-detail validation issues."
            }

        if rto_probability >= hold:
            return {
                "decision": "HOLD_REVIEW",
                "risk_probability": rto_probability,
                "reason": "Very high predicted RTO risk."
            }

        if rto_probability >= prepaid:
            return {
                "decision": "NUDGE_PREPAID",
                "risk_probability": rto_probability,
                "reason": "High predicted RTO risk. Encourage prepaid payment."
            }

        if rto_probability >= confirm or medium_risk > 0 or high_risk > 0:
            return {
                "decision": "CONFIRM_ORDER",
                "risk_probability": rto_probability,
                "reason": "Some delivery or RTO risk indicators require confirmation."
            }

        return {
            "decision": "SHIP_AS_IS",
            "risk_probability": rto_probability,
            "reason": "Low predicted RTO risk and customer details passed validation."
        }