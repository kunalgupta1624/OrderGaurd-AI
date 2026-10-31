from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, model_validator

from app.services.settings_store import SettingsStore


router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"]
)

settings_store = SettingsStore()


class ThresholdRequest(BaseModel):

    confirm_threshold: float = Field(ge=0, le=1)
    prepaid_threshold: float = Field(ge=0, le=1)
    hold_threshold: float = Field(ge=0, le=1)

    @model_validator(mode="after")
    def validate_threshold_order(self):

        if not (
            self.confirm_threshold
            < self.prepaid_threshold
            < self.hold_threshold
        ):
            raise ValueError(
                "Thresholds must be in increasing order: "
                "confirm < prepaid < hold."
            )

        return self


@router.get("/thresholds")
def get_thresholds():
    return settings_store.get_settings()


@router.put("/thresholds")
def update_thresholds(settings: ThresholdRequest):

    try:
        settings_store.save_settings(settings.model_dump())

        return {
            "message": "Decision thresholds updated successfully.",
            "settings": settings.model_dump()
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )