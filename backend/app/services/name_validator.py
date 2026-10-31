import re

SUSPICIOUS_NAMES = {
    "asdf",
    "qwerty",
    "test",
    "xyz",
    "abc",
    "unknown",
    "dummy"
}


def validate_customer_name(name: str):

    if not name or not name.strip():

        return {
            "valid": False,
            "risk": "HIGH",
            "reason": "Customer name is missing."
        }

    name = name.strip().lower()

    if name in SUSPICIOUS_NAMES:

        return {
            "valid": False,
            "risk": "HIGH",
            "reason": "Customer name contains suspicious placeholder text."
        }

    if len(name) < 3:

        return {
            "valid": False,
            "risk": "MEDIUM",
            "reason": "Customer name is unusually short."
        }

    if re.fullmatch(r"[^a-zA-Z\s.]", name):

        return {
            "valid": False,
            "risk": "HIGH",
            "reason": "Customer name contains invalid characters."
        }

    return {
        "valid": True,
        "risk": "LOW",
        "reason": "Customer name passed basic validation."
    }


