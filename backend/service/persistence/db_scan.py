from loguru import logger
from backend import models
from sqlalchemy.orm import Session


def get_scan_event(scan_id, db: Session = None):
    scan_event = db.query(models.ScanEvent).filter(models.ScanEvent.scan_id == scan_id).first()
    if not scan_event:
        logger.error("ScanEvent not found.")
        return None

    return scan_event


def get_latest_scan_event(profile_id, db: Session = None):
    scan_event = (
        db.query(models.ScanEvent)
        .filter(models.ScanEvent.profile_id == profile_id)
        .order_by(models.ScanEvent.scan_id.desc())
        .first()
    )
    if not scan_event:
        logger.warning("ScanEvent not found.")
        return None

    return scan_event
