import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
SETTINGS_FILE = PROJECT_ROOT / "data" / "settings.json"


DEFAULT_SETTINGS = {
    "confirm_threshold": 0.30,
    "prepaid_threshold": 0.50,
    "hold_threshold": 0.85
}


class SettingsStore:

    def __init__(self):
        SETTINGS_FILE.parent.mkdir(parents=True, exist_ok=True)

        if not SETTINGS_FILE.exists():
            self.save_settings(DEFAULT_SETTINGS)

    def get_settings(self):
        with open(SETTINGS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)

    def save_settings(self, settings):
        with open(SETTINGS_FILE, "w", encoding="utf-8") as file:
            json.dump(settings, file, indent=4)