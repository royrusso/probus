import uuid
from fastapi import APIRouter, Depends, status
from backend import models
from backend.db import get_db
from sqlalchemy.orm import Session
from backend.schemas import ProfileBase, ProfileOnlyRead
from backend.service.persistence import db_profile
from backend.service.profile_scan import ProfileScanService

router = APIRouter()


@router.get("/profile/{profile_id}", response_model=ProfileOnlyRead, tags=["profile"])
def get_profile(profile_id: str, db: Session = Depends(get_db)):
    """
    Get a profile by ID.
    """

    profile = db_profile.get_profile(profile_id, db)
    return profile


@router.get("/profile/{profile_id}/scan", response_model=ProfileOnlyRead, tags=["profile"])
async def scan_profile(profile_id: str, db: Session = Depends(get_db)):
    """
    Scan the target profile.

    """
    profile_service = ProfileScanService(profile_id, db)
    profile = await profile_service.scan_profile()

    return profile


@router.get("/profiles/latest/{count}", response_model=list[ProfileOnlyRead], tags=["profile"])
def get_profiles_latest(count: int, db: Session = Depends(get_db)):
    """
    Get latest profiles, using `latest_scan` as a sort.
    """
    profiles = db_profile.get_profiles_latest(count, db)

    return [ProfileOnlyRead.model_validate(profile) for profile in profiles]


@router.get("/profiles/", response_model=list[ProfileOnlyRead], tags=["profile"])
def get_profiles(db: Session = Depends(get_db)):
    """
    Get all profiles.
    """
    profiles = db_profile.get_profiles(db)
    return [ProfileOnlyRead.model_validate(profile) for profile in profiles]


@router.post("/profile", response_model=ProfileOnlyRead, status_code=status.HTTP_201_CREATED, tags=["profile"])
def create_profile(profile: ProfileBase, db: Session = Depends(get_db)):
    """
    Create a new profile.
    """
    db_profile = models.Profile(**profile.model_dump())
    db_profile.profile_id = str(uuid.uuid4())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.patch("/profile/{profile_id}", tags=["profile"])
def update_profile(profile_id: str, profile: ProfileBase, db: Session = Depends(get_db)):
    """
    Update a profile by ID.
    """
    db_profile = db.query(models.Profile).filter(models.Profile.profile_id == profile_id).first()
    db_profile.update(**profile.model_dump())
    db.commit()
    db.refresh(db_profile)
    return {"status": "success", "data": db_profile}


@router.delete("/profile/{profile_id}", tags=["profile"])
def delete_profile(profile_id: str, db: Session = Depends(get_db)):
    """
    Delete a profile by ID.
    """
    db_profile = db.query(models.Profile).filter(models.Profile.profile_id == profile_id).first()
    db.delete(db_profile)
    db.commit()
    return {"status": "success", "data": None}
