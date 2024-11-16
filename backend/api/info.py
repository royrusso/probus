from fastapi import APIRouter
import FindMyIP as ip

router = APIRouter()


@router.get("/ipinfo", tags=["info"])
def get_ip_info():
    """
    Returns information about the IP address of the server.
    """
    return {"internet_connected": ip.internet(), "internal_ip": ip.internal(), "external_ip": ip.external()}
