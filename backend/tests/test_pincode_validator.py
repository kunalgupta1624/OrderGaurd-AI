from app.services.pincode_validator import PincodeValidator


validator = PincodeValidator()


def test_valid_pincode():

    result = validator.validate("462001")

    assert result["valid"] is True
    assert result["risk"] == "LOW"


def test_invalid_pincode():

    result = validator.validate("12345")

    assert result["valid"] is False
    assert result["risk"] == "HIGH"


def test_pincode_starting_with_zero():

    result = validator.validate("012345")

    assert result["valid"] is False


def test_missing_pincode():

    result = validator.validate(None)

    assert result["valid"] is False


def test_excel_format_pincode():

    result = validator.validate("462001.0")

    assert result["valid"] is True