from pydantic import BaseModel
from typing import Literal


class AddressAnalysis(BaseModel):

    understandable: bool

    language: Literal[
        "English",
        "Hindi",
        "Hinglish",
        "Mixed",
        "Unknown"
    ]

    completeness: Literal[
        "HIGH",
        "MEDIUM",
        "LOW"
    ]

    missing_information: list[str]

    identified_components: list[str]

    explanation: str

    requires_customer_confirmation: bool