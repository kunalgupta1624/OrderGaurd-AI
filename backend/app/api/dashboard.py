from fastapi import APIRouter

from app.services.order_store import OrderStore

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

order_store = OrderStore()


@router.get("/summary")
def get_dashboard_summary():

    orders = order_store.get_all_orders()

    total_orders = len(orders)

    # Count orders by decision
    decision_counts = {
        "SHIP_AS_IS": 0,
        "CONFIRM_ORDER": 0,
        "NUDGE_PREPAID": 0,
        "HOLD_REVIEW": 0
    }

    total_rto_savings = 0.0
    total_cancelled_value = 0.0

    for order in orders:

        decision = order.get("recommended_action")

        if decision in decision_counts:
            decision_counts[decision] += 1

        # Estimated savings from orders moved to prepaid
        if decision == "NUDGE_PREPAID":
            offer = order.get("prepaid_offer")

            if offer:
                total_rto_savings += offer["expected_savings"]

        # Track value of orders held for review
        if decision == "HOLD_REVIEW":
            total_cancelled_value += order.get("order_value", 0)

    return {
        "total_orders_evaluated": total_orders,

        "decision_breakdown": decision_counts,

        "estimated_rto_savings": round(
            total_rto_savings, 2
        ),

        "value_of_orders_held_for_review": round(
            total_cancelled_value, 2
        ),

        "net_estimated_impact": round(
            total_rto_savings - total_cancelled_value, 2
        )
    }