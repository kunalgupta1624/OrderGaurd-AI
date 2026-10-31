from pydantic import BaseModel, Field
from datetime import datetime


class OrderRequest(BaseModel):

    order_id: str

    customer_name: str

    phone: str

    address: str

    city: str

    state: str

    pincode: str

    order_value: float = Field(gt=0)

    num_items: int = Field(gt=0)

    customer_prior_orders: int = Field(ge=0)

    customer_prior_rto: int = Field(ge=0)

    order_datetime: datetime

    courier: str

    utm_source: str