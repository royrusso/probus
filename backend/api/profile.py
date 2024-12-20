import uuid
from fastapi import APIRouter, Depends, status
from backend import models, schemas
from backend.db import get_db
from sqlalchemy.orm import Session
from backend.schemas import ProfileOnlyRead

router = APIRouter()


@router.get("/profile/{profile_id}", response_model=ProfileOnlyRead, tags=["profile"])
def get_profile(profile_id: str, db: Session = Depends(get_db)):
    """
    Get a profile by ID.
    """

    profile = db.query(models.Profile).filter(models.Profile.profile_id == profile_id).first()
    return profile


@router.get("/profiles/latest/{count}", response_model=list[ProfileOnlyRead], tags=["profile"])
def get_profiles(count: int, db: Session = Depends(get_db)):
    """
    Get latest X profiles.
    """
    profiles = db.query(models.Profile).order_by(models.Profile.last_scan.desc()).limit(count).all()

    return [ProfileOnlyRead.model_validate(profile) for profile in profiles]


@router.get("/profiles/", response_model=list[ProfileOnlyRead], tags=["profile"])
def get_profiles(db: Session = Depends(get_db)):
    """
    Get all profiles.
    """
    profiles = db.query(models.Profile).all()
    return [ProfileOnlyRead.model_validate(profile) for profile in profiles]


@router.post("/profile", response_model=ProfileOnlyRead, status_code=status.HTTP_201_CREATED, tags=["profile"])
def create_profile(profile: schemas.ProfileBaseSchema, db: Session = Depends(get_db)):
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
def update_profile(profile_id: str, profile: schemas.ProfileBaseSchema, db: Session = Depends(get_db)):
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
