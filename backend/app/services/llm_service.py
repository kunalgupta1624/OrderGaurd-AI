import os

from openai import OpenAI
from dotenv import load_dotenv

from app.schemas.address_analysis import AddressAnalysis


# Load environment variables
load_dotenv()


class AddressIntelligence:

    def __init__(self):

        api_key = os.getenv("OPENAI_API_KEY")

        model = os.getenv("OPENAI_MODEL")

        if not api_key:
            raise ValueError(
                "OPENAI_API_KEY is missing."
            )

        if not model:
            raise ValueError(
                "OPENAI_MODEL is missing."
            )

        self.model = model

        self.client = OpenAI(
            api_key=api_key
        )

    def analyze_address(self, address: str):

        if not address or not address.strip():

            raise ValueError(
                "Address cannot be empty."
            )

        response = self.client.responses.parse(

            model=self.model,

            input=[

                {
                    "role": "system",

                    "content": """
                    You are an Indian e-commerce address
                    interpretation assistant.

                    Understand English, Hindi and Hinglish.

                    Analyze the delivery address.

                    Identify:
                    1. Language used.
                    2. Whether the address is understandable.
                    3. Whether it contains sufficient details.
                    4. Missing delivery information.
                    5. Identifiable address components.

                    Do not claim that an address physically exists.

                    Do not invent missing information.

                    A landmark alone is not sufficient evidence
                    of a complete delivery address.

                    If the address is ambiguous, recommend
                    customer confirmation.
                    """
                },

                {
                    "role": "user",

                    "content": f"""
                    Analyze this delivery address:

                    {address}
                    """
                }

            ],

            text_format=AddressAnalysis

        )

        result = response.output_parsed

        if result is None:

            raise ValueError(
                "AI did not return a valid address analysis."
            )

        return result.model_dump()