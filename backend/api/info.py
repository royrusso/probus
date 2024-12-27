import os
from fastapi import APIRouter
import FindMyIP as ip
from loguru import logger
from service.nmap import NmapScanner

router = APIRouter()


@router.get("/info/ip", tags=["info"])
def get_ip_info():
    """
    Returns information about the IP address of the server.
    """
    return {"internet_connected": ip.internet(), "internal_ip": ip.internal(), "external_ip": ip.external()}


@router.get("/info/nmap_info", tags=["info"])
def which_nmap():
    """
    Returns the path to the nmap binary.
    """
    scanner = NmapScanner()
    nmap_version = scanner.nmap_version()
    which_nmap = scanner.which_nmap()

    return {"nmap_version": nmap_version, "nmap_path": which_nmap}


@router.get("/info/is_root", tags=["info"])
def is_root():
    """
    Returns whether the user is root or not.
    """
    if os.geteuid() != 0:
        logger.error("You need to have root privileges. Some functionality may not work as expected.")
        return {"is_root": False}
    return {"is_root": True}


@router.get("/info/health", tags=["info"])
def read_health():
    return {"status": "OK"}
