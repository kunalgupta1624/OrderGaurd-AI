import json
from pathlib import Path
from datetime import datetime, timezone


PROJECT_ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = PROJECT_ROOT / "data"
ORDERS_FILE = DATA_DIR / "evaluated_orders.json"


class OrderStore:

    def __init__(self):
        DATA_DIR.mkdir(parents=True, exist_ok=True)

        if not ORDERS_FILE.exists():
            ORDERS_FILE.write_text("[]", encoding="utf-8")

    def save_order(self, order_data: dict):

        orders = self.get_all_orders()

        order_data["evaluated_at"] = datetime.now(
            timezone.utc
        ).isoformat()

        orders.append(order_data)

        ORDERS_FILE.write_text(
            json.dumps(orders, indent=4),
            encoding="utf-8"
        )

    def get_all_orders(self):

        with open(ORDERS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)