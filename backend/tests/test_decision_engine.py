import pytest

from app.services.decision_engine import OrderDecisionEngine


@pytest.fixture
def engine():
    return OrderDecisionEngine()


def test_low_risk_order(engine):
    result = engine.evaluate(
        0.10,
        {"high_risk_count": 0, "medium_risk_count": 0}
    )
    assert result["decision"] == "SHIP_AS_IS"


def test_medium_risk_order(engine):
    result = engine.evaluate(
        0.35,
        {"high_risk_count": 0, "medium_risk_count": 0}
    )
    assert result["decision"] == "CONFIRM_ORDER"


def test_high_risk_order(engine):
    result = engine.evaluate(
        0.65,
        {"high_risk_count": 0, "medium_risk_count": 0}
    )
    assert result["decision"] == "NUDGE_PREPAID"


def test_very_high_risk_order(engine):
    result = engine.evaluate(
        0.90,
        {"high_risk_count": 0, "medium_risk_count": 0}
    )
    assert result["decision"] == "HOLD_REVIEW"


def test_invalid_probability(engine):
    with pytest.raises(ValueError):
        engine.evaluate(
            1.5,
            {"high_risk_count": 0, "medium_risk_count": 0}
        )