from dataclasses import dataclass


@dataclass
class DiscountConfig:
    forward_shipping: float = 65.0
    return_shipping: float = 65.0
    packaging_cost: float = 25.0

    damage_probability: float = 0.08
    damaged_product_cost: float = 180.0

    cod_rto_probability: float = 0.28
    prepaid_rto_probability: float = 0.04

    max_discount_percentage: float = 0.05


class PrepaidDiscountCalculator:

    def __init__(self, config=None):
        self.config = config or DiscountConfig()

    def calculate(self, order_value: float) -> dict:

        if order_value <= 0:
            raise ValueError("Order value must be greater than zero.")

        config = self.config

        if not 0 <= config.cod_rto_probability <= 1:
            raise ValueError("Invalid COD RTO probability.")

        if not 0 <= config.prepaid_rto_probability <= 1:
            raise ValueError("Invalid prepaid RTO probability.")

        if not 0 <= config.max_discount_percentage <= 1:
            raise ValueError("Invalid maximum discount percentage.")

        if config.prepaid_rto_probability > config.cod_rto_probability:
            raise ValueError(
                "Prepaid RTO probability cannot exceed COD RTO probability."
            )

        expected_damage_cost = (
            config.damage_probability * config.damaged_product_cost
        )

        total_rto_cost = (
            config.forward_shipping
            + config.return_shipping
            + config.packaging_cost
            + expected_damage_cost
        )

        avoided_rto_probability = (
            config.cod_rto_probability
            - config.prepaid_rto_probability
        )

        expected_savings = (
            avoided_rto_probability * total_rto_cost
        )

        maximum_discount = (
            order_value * config.max_discount_percentage
        )

        recommended_discount = min(
            expected_savings,
            maximum_discount
        )

        return {
            "order_value": round(order_value, 2),
            "expected_rto_cost": round(total_rto_cost, 2),
            "expected_savings": round(expected_savings, 2),
            "maximum_allowed_discount": round(maximum_discount, 2),
            "recommended_discount": round(recommended_discount, 2),
            "final_prepaid_amount": round(
                order_value - recommended_discount, 2
            ),
            "discount_percentage": round(
                (recommended_discount / order_value) * 100, 2
            )
        }