from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class ProfileRead(BaseModel):
    profile_id: str
    profile_name: str
    profile_description: Optional[str] = None
    ip_range: str
    last_scan: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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
