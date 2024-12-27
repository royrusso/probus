from loguru import logger
from backend import models
from sqlalchemy.orm import Session


def get_profile(profile_id: str, db: Session = None):
    profile = db.query(models.Profile).filter(models.Profile.profile_id == profile_id).first()
    if not profile:
        logger.error("Profile not found.")
        return None

    return profile


def get_profiles(db: Session = None):
    profiles = db.query(models.Profile).all()
    return profiles


def get_profiles_latest(count: int, db: Session = None):
    profiles = db.query(models.Profile).order_by(models.Profile.last_scan.desc()).limit(count).all()
    return profiles


def save_profile(profile: models.Profile, db: Session = None):
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
