from fastapi import APIRouter
from service.nmap import NmapScanner

router = APIRouter()


@router.get("/nmap/detailed/{ip_address:path}", tags=["nmap"])
async def nmap_detailed(ip_address: str):
    """
    Detailed scan of the target IP address, including port scan.

    In NMap terms, it runs a TCP SYN scan (nmap -sS) with a minimum rate of 2000 packets per second.
    """
    nmap_scanner = NmapScanner()
    result = nmap_scanner.scan(ip_address, "detailed")
    return {"result": result}


@router.get("/nmap/ping/{ip_address:path}", tags=["nmap"])
async def nmap_basic(ip_address: str):
    """
    First pass at a scan. Just pings the target and conducts a traceroute. No port scan.

    In NMap terms, it runs a basic no-port-scan (nmap -sn --traceroute).
    """
    nmap_scanner = NmapScanner()

    result = nmap_scanner.scan(ip_address, "ping")
    return {"result": result}


@router.get("/nmap/os/{ip_address:path}", tags=["nmap"])
async def nmap_os(ip_address: str):
    """
    Scan the target IP address for OS detection.

    In NMap terms, it runs an OS detection scan (nmap -Pn -O).
    """
    nmap_scanner = NmapScanner()
    result = nmap_scanner.scan(ip_address, "os")
    return {"result": result}


@router.get("/nmap/vuln/{ip_address:path}", tags=["nmap"])
async def nmap_vuln(ip_address: str):
    """
    Scan the target IP address for OS detection and vulnerabilities.

    In NMap terms, it runs a service/version detection scan and a vulnerability scan (nmap --script vulners -sV -O).
    """
    nmap_scanner = NmapScanner()
    result = nmap_scanner.scan(ip_address, "vuln")
    return {"result": result}


@router.get("/nmap/list/{ip_address:path}", tags=["nmap"])
async def nmap_list(ip_address: str):
    """
    Returns a list of IP addresses to scan. This call does NOT perform scan, ping, traceroute, etc. and simply returns
    a list of IP addresses with hostnames, if found.
    """
    nmap_scanner = NmapScanner()
    try:
        response = nmap_scanner.list_scan(ip_address)
    except Exception as e:
        response = str(e)
    return {"result": response}
