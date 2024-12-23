from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from typing import List, Optional


class ProfileOnlyRead(BaseModel):
    """
    A thin profile model that only includes the profile information and no child objects.
    """

    profile_id: str
    profile_name: str
    profile_description: Optional[str] = None
    ip_range: str
    last_scan: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProfileBase(BaseModel):
    """
    A base profile model that includes the profile information mainly used on create/update.
    """

    profile_id: str | None = None
    profile_name: str
    ip_range: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class ScanEventRead(BaseModel):
    scan_id: int
    profile_id: str
    scan_command: str
    scan_start: datetime
    scan_end: datetime
    scan_status: str
    scan_summary: Optional[str]
    created_at: datetime
    hosts: List["HostRead"] = []

    class Config:
        from_attributes = True


class HostRead(BaseModel):
    host_id: int
    scan_id: int
    start_time: datetime
    end_time: datetime
    state: str
    reason: Optional[str]
    latency: Optional[int]
    created_at: datetime
    addresses: List["AddressRead"] = []
    hostnames: List["HostNameRead"] = []
    ports: List["PortRead"] = []

    class Config:
        from_attributes = True


class AddressRead(BaseModel):
    address_id: int
    host_id: int
    address_type: str
    address: str
    vendor: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class HostNameRead(BaseModel):
    hostname_id: int
    host_id: int
    host_name: str
    host_type: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class PortRead(BaseModel):
    port_id: int
    host_id: int
    port_number: int
    protocol: str
    state: Optional[str]
    service: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
