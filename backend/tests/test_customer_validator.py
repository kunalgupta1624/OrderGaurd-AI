from app.services.customer_validator import CustomerValidator


validator = CustomerValidator()


def test_valid_customer():

    result = validator.validate(
        name="Anup Kumar",
        address="House 123 MP Nagar Bhopal Madhya Pradesh",
        pincode="462001"
    )

    assert (
        result["validation_summary"]["overall_status"]
        == "PASSED"
    )


def test_invalid_customer_name():

    result = validator.validate(
        name="asdf",
        address="House 123 MP Nagar Bhopal Madhya Pradesh",
        pincode="462001"
    )

    assert (
        result["validation_summary"]["overall_status"]
        == "REVIEW"
    )


def test_invalid_address():

    result = validator.validate(
        name="Anup Kumar",
        address=".",
        pincode="462001"
    )

    assert (
        result["validation_summary"]["overall_status"]
        == "REVIEW"
    )


def test_invalid_pincode():

    result = validator.validate(
        name="Anup Kumar",
        address="House 123 MP Nagar Bhopal Madhya Pradesh",
        pincode="12345"
    )

    assert (
        result["validation_summary"]["overall_status"]
        == "REVIEW"
    )


def test_all_invalid_information():

    result = validator.validate(
        name="asdf",
        address=".",
        pincode="123"
    )

    assert (
        result["validation_summary"]["high_risk_count"]
        == 3
    )