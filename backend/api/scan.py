
from fastapi import FastAPI
from typing import Union
from fastapi import APIRouter
from backend.scan.nmap import NmapScanner

router = APIRouter()

@router.get("/scan_detailed/{ip_address}", tags=["nmap"])
async def scan_detailed(ip_address: str):
    """
    Detailed scan of the target IP address, including port scan. 

    In NMap terms, it runs a TCP SYN scan (nmap -sS) with a minimum rate of 2000 packets per second.
    """
    nmap_scanner = NmapScanner()
    #nmap.target = "192.168.50.140-144"
    #nmap.target = "192.168.20.51-58"
    #nmap.target = "192.168.20.51"
    #nmap_scanner.target = "192.168.1.196"
    #nmap.target = "192.168.1.180"
    result = nmap_scanner.scan("192.168.1.196", "detailed")    
    return { "result" : result}

@router.get("/scan_ping/{ip_address}", tags=["nmap"])
async def scan_basic(ip_address: str):
    """
    First pass at a scan. Just pings the target and conducts a traceroute. No port scan. 

    In NMap terms, it runs a basic no-port-scan (nmap -sn --traceroute).
    """
    nmap_scanner = NmapScanner()

    #nmap.target = "192.168.50.140-144"
    #nmap.target = "192.168.20.51-58"
    #nmap.target = "192.168.20.51"
    #nmap_scanner.target = "192.168.1.196"
    #nmap.target = "192.168.1.180"
    result = nmap_scanner.scan("192.168.1.196", "ping")    
    return { "result" : result}

@router.get("/scan_list/{ip_address}", tags=["nmap"])
async def scan_list(ip_address: str):
    """
    Returns a list of IP addresses to scan.
    """
    nmap_scanner = NmapScanner()
    return nmap_scanner.list_scan("192.168.1.0/24")