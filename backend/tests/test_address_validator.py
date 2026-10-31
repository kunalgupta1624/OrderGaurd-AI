from app.services.address_validator import AddressValidator


validator = AddressValidator()


def test_complete_address():

    result = validator.validate(
        "House 123 MP Nagar Bhopal Madhya Pradesh"
    )

    assert result["valid"] is True
    assert result["risk"] == "LOW"


def test_incomplete_address():

    result = validator.validate(
        "Near railway station"
    )

    assert result["risk"] == "HIGH"


def test_placeholder_address():

    result = validator.validate(".")

    assert result["valid"] is False
    assert result["risk"] == "HIGH"


def test_empty_address():

    result = validator.validate("")

    assert result["valid"] is False


def test_missing_address():

    result = validator.validate(None)

    assert result["valid"] is False


def test_hinglish_address():

    result = validator.validate(
        "Ghar Hanuman mandir ke samne MP Nagar Bhopal"
    )

    assert result["valid"] is True