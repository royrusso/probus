import os
from fastapi import APIRouter
import FindMyIP as ip
from loguru import logger

router = APIRouter()


@router.get("/ipinfo", tags=["info"])
def get_ip_info():
    """
    Returns information about the IP address of the server.
    """
    return {"internet_connected": ip.internet(), "internal_ip": ip.internal(), "external_ip": ip.external()}


@router.get("/is_root", tags=["info"])
def is_root():
    """
    Returns whether the user is root or not.
    """
    if os.geteuid() != 0:
        logger.error("You need to have root privileges. Some functionality may not work as expected.")
        return {"is_root": False}
    return {"is_root": True}
