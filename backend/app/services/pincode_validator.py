import re


class PincodeValidator:

    def validate(self, pincode):

        if pincode is None:

            return {
                "valid": False,
                "risk": "HIGH",
                "reason": "Pincode is missing."
            }

        pincode = str(pincode).strip()

        # Handle Excel-style values such as 462001.0
        if pincode.endswith(".0"):
            pincode = pincode[:-2]

        # Indian pincodes contain six digits
        if not re.fullmatch(r"[1-9][0-9]{5}", pincode):

            return {
                "valid": False,
                "risk": "HIGH",
                "reason": "Invalid Indian pincode format."
            }

        return {
            "valid": True,
            "risk": "LOW",
            "reason": "Pincode format is valid."
        }