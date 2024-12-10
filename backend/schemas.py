from datetime import datetime
from typing import List
from pydantic import BaseModel


class ProfileBaseSchema(BaseModel):
    profile_id: str | None = None
    profile_name: str
    ip_range: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class ListProfileResponse(BaseModel):
    status: str
    results: int
    notes: List[ProfileBaseSchema]
