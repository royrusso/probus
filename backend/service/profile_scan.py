from datetime import datetime
import traceback
from loguru import logger
from sqlalchemy.orm import Session

from backend.service.nmap import NmapScanner
from backend.service.nmap_parser import NMapParserService
from backend.service.persistence import db_profile


class ProfileScanService(object):
    """
    This class is responsible for scanning a profile. It will leverage the nmap service for a multi-step scan and interact with the database to store the results.
    """

    def __init__(self, profile_id: str = None, db: Session = None):
        self.profile_id = profile_id
        self.db = db

    async def scan_profile(self):
        """
        An async method to scan the profile.

        This has to be done as a two-part scan. First we will scan using a ping scan to get the IP addresses of hosts that are "up"
        and then we will scan the IP addresses using "detailed" mode.
        TODO: supposed custom scans defined in the profile.
        """

        profile = db_profile.get_profile(self.profile_id, self.db)
        nmap_scanner = NmapScanner()

        scan_results = {}
        try:
            ping_results = await nmap_scanner.scan(
                profile.ip_range, "ping"
            )  # TODO: make this configurable, because not all networks will need a two-step scan
            up_hosts = []
            if ping_results:

                nmap_hosts = ping_results["nmaprun"].get("host", [])

                if (nmap_hosts is None) or (len(nmap_hosts) == 0):
                    logger.error(f"No hosts found in ping scan for profile {self.profile_id}")
                    return

                for host in nmap_hosts:
                    if host["status"]["@state"] == "up":
                        # we need to ignore hosts that have no hostname
                        hostnames = host.get("hostnames", None)
                        if isinstance(hostnames, dict):
                            hostnames = [hostnames]
                        elif isinstance(hostnames, list):
                            hostnames = hostnames

                        if hostnames is None or len(hostnames) == 0:
                            continue

                        address = host["address"]  # address can be a dict or a list
                        if isinstance(address, dict):
                            if address["@addrtype"] == "ipv4":  # TODO: handle ipv6
                                up_hosts.append(host["address"]["@addr"])
                        elif isinstance(address, list):
                            for addr in address:
                                if addr["@addrtype"] == "ipv4":
                                    up_hosts.append(addr["@addr"])

                logger.info(f"Hosts that are up: {up_hosts}")
                if len(up_hosts) > 0:
                    concat_ips: str = " ".join(up_hosts)
                    scan_results = await nmap_scanner.scan(concat_ips, "detailed")
                    if scan_results and "nmaprun" in scan_results:

                        nmap_parser = NMapParserService(scan_results, profile)

                        scan_event = nmap_parser.build_scan_event_from_results()
                        profile.scan_events.append(scan_event)
                        profile.last_scan = datetime.now()
                        db_profile.save_profile(profile, self.db)

        except Exception as e:
            logger.error(f"Error scanning profile {self.profile_id}: {e}")
            traceback.print_exc()
            return

        return profile
