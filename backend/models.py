import uuid
from sqlalchemy import UUID, Column, DateTime, String
from db import Base
from sqlalchemy.sql import func


class Profile(Base):
    """
    Profile model
    """

    __tablename__ = "profile"
    profile_id = Column(String, primary_key=True, index=True)
    profile_name = Column(String, nullable=False)
    profile_description = Column(String, nullable=True)
    ip_range = Column(String, nullable=False)
    last_scan = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)


class Scan(Base):
    """
    Scan model
    """

    __tablename__ = "scan_history"
    scan_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(String, nullable=False)
    scan_command = Column(String, nullable=True)  # "@args": "/opt/homebrew/bin/nmap -sn -T4 -oX - 192.168.1.0/24",
    scan_start = Column(DateTime, nullable=True)
    scan_end = Column(DateTime, nullable=True)
    scan_results_json = Column(String, nullable=True)


class Host(Base):
    """
    Host model
    """

    __tablename__ = "host"
    host_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), nullable=False)
    ip_address = Column(String, nullable=False)
    hostname = Column(String, nullable=True)
    os = Column(String, nullable=True)
    os_accuracy = Column(String, nullable=True)
    scan_summary = Column(String, nullable=True)
    scan_start = Column(DateTime, nullable=True)
    scan_end = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
