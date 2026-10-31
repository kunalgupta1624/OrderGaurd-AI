from pprint import pprint

from app.services.llm_service import AddressIntelligence


ai = AddressIntelligence()


address = """
Ghar Hanuman mandir ke samne hai,
MP Nagar zone 2, Bhopal.
"""


result = ai.analyze_address(address)

pprint(result)