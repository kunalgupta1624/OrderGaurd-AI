import re


class AddressValidator:

    LOCATION_KEYWORDS = [
        "road", "street", "nagar", "colony",
        "sector", "block", "flat", "house",
        "village", "market", "apartment",
        "building", "phase", "lane"
    ]

    PLACEHOLDER_VALUES = {
        ".", "-", "test", "unknown",
        "null", "none", "na", "n/a"
    }

    def validate(self, address: str) -> dict:

        if not isinstance(address, str) or not address.strip():

            return self._result(
                score=0,
                risk="HIGH",
                valid=False,
                reason="Address is missing."
            )

        address = address.strip().lower()

        if address in self.PLACEHOLDER_VALUES:

            return self._result(
                score=0,
                risk="HIGH",
                valid=False,
                reason="Address contains placeholder information."
            )

        score = 0

        # Check address length
        if len(address) >= 15:
            score += 25

        # Check number of words
        if len(address.split()) >= 4:
            score += 20

        # Check house or building number
        if re.search(r"\d", address):
            score += 20

        # Check location-related keywords
        if any(
            keyword in address.split()
            for keyword in self.LOCATION_KEYWORDS
        ):
            score += 25

        # Check whether address contains alphabetic characters
        if re.search(r"[a-z]", address):
            score += 10

        score = min(score, 100)

        if score >= 70:
            risk = "LOW"

        elif score >= 40:
            risk = "MEDIUM"

        else:
            risk = "HIGH"

        return self._result(
            score=score,
            risk=risk,
            valid=score >= 40,
            reason="Address evaluated using structural validation."
        )

    @staticmethod
    def _result(score, risk, valid, reason):

        return {
            "valid": valid,
            "score": score,
            "risk": risk,
            "reason": reason
        }