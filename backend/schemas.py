from datetime import datetime
from typing import List
from pydantic import BaseModel


class ProfileBaseSchema(BaseModel):
    profile_id: str | None = None
    profile_name: str
    ip_range: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class ListProfileResponse(BaseModel):
    status: str
    results: int
    notes: List[ProfileBaseSchema]
