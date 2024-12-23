from fastapi import APIRouter, Depends
from backend.db import get_db
from sqlalchemy.orm import Session
from backend.schemas import ScanEventRead
from backend.service.persistence import db_scan

router = APIRouter()


@router.get("/scan_event/{scan_id}", response_model=ScanEventRead, tags=["scan"])
def get_scan_event(scan_id: int, db: Session = Depends(get_db)):
    """
    Get a ScanEvent by ID.
    """

    scan_event = db_scan.get_scan_event(scan_id, db)
    return scan_event


@router.get("/scan_event/latest/{profile_id}", response_model=ScanEventRead, tags=["scan"])
def get_latest_scan_event(profile_id: str, db: Session = Depends(get_db)):
    """
    Get the latest ScanEvent for a profile.
    """

    scan_event = db_scan.get_latest_scan_event(profile_id, db)
    return scan_event
