from app.services.name_validator import validate_customer_name


def test_valid_customer_name():

    result = validate_customer_name("Anup Kumar")

    assert result["valid"] is True
    assert result["risk"] == "LOW"


def test_suspicious_customer_name():

    result = validate_customer_name("asdf")

    assert result["valid"] is False
    assert result["risk"] == "HIGH"


def test_empty_customer_name():

    result = validate_customer_name("")

    assert result["valid"] is False
    assert result["risk"] == "HIGH"