from app.services.name_validator import validate_customer_name

from app.services.address_validator import AddressValidator

from app.services.pincode_validator import PincodeValidator


class CustomerValidator:

    def __init__(self):

        # Initialize individual validators
        self.address_validator = AddressValidator()
        self.pincode_validator = PincodeValidator()

    def validate(self, name, address, pincode):

        # 1. Validate customer name
        name_result = validate_customer_name(name)

        # 2. Validate delivery address
        address_result = self.address_validator.validate(address)

        # 3. Validate pincode
        pincode_result = self.pincode_validator.validate(pincode)

        # 4. Collect validation results
        results = [
            name_result,
            address_result,
            pincode_result
        ]

        # 5. Calculate risk counts
        high_risk_count = sum(
            1 for result in results
            if result.get("risk") == "HIGH"
        )

        medium_risk_count = sum(
            1 for result in results
            if result.get("risk") == "MEDIUM"
        )

        # 6. Determine overall validation status
        if high_risk_count > 0 or medium_risk_count > 0:
            overall_status = "REVIEW"
        else:
            overall_status = "PASSED"

        # 7. Return validation report
        return {
            "customer_name": name_result,
            "address": address_result,
            "pincode": pincode_result,

            "validation_summary": {
                "overall_status": overall_status,
                "high_risk_count": high_risk_count,
                "medium_risk_count": medium_risk_count
            }
        }