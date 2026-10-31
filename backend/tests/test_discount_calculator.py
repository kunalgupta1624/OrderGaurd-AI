import pytest

from app.services.discount_calculator import PrepaidDiscountCalculator


@pytest.fixture
def calculator():
    return PrepaidDiscountCalculator()


def test_discount_calculation(calculator):

    result = calculator.calculate(649)

    assert result["expected_rto_cost"] == 169.40
    assert result["expected_savings"] == 40.66
    assert result["recommended_discount"] == 32.45
    assert result["final_prepaid_amount"] == 616.55


def test_discount_percentage(calculator):

    result = calculator.calculate(649)

    assert result["discount_percentage"] == 5.0


def test_zero_order_value(calculator):

    with pytest.raises(ValueError):
        calculator.calculate(0)


def test_negative_order_value(calculator):

    with pytest.raises(ValueError):
        calculator.calculate(-500)


def test_invalid_probability():

    from app.services.discount_calculator import DiscountConfig

    config = DiscountConfig(cod_rto_probability=1.5)
    calculator = PrepaidDiscountCalculator(config)

    with pytest.raises(ValueError):
        calculator.calculate(649)