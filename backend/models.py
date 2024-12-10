from db import Base
from sqlalchemy import TIMESTAMP, Column, String
from sqlalchemy.sql import func
import uuid


class Profile(Base):
    """
    Profile model
    """

    __tablename__ = "profile"
    profile_id = Column(String, primary_key=True, default=str(uuid.uuid4()))
    profile_name = Column(String, nullable=False)
    ip_range = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
