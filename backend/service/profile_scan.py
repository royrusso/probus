from datetime import datetime
from loguru import logger
from backend import models
from sqlalchemy.orm import Session

from backend.service.nmap import NmapScanner
from backend.service.nmap_parser import NMapParserService


class ProfileScanService(object):
    """
    This class is responsible for scanning a profile. It will leverage the nmap service for a multi-step scan and interact with the database to store the results.
    """

    def __init__(self, profile_id: str = None, db: Session = None):
        self.profile_id = profile_id
        self.db = db

    def get_profile(self):
        profile = self.db.query(models.Profile).filter(models.Profile.profile_id == self.profile_id).first()
        if not profile:
            logger.error("Profile not found.")
            return None

        self.profile = profile
        return profile

    def scan_profile(self):
        """
        This has to be done as a two-part scan. First we will scan using a ping scan to get the IP addresses of hosts that are "up"
        and then we will scan the IP addresses using "detailed" mode.
        """

        profile = self.get_profile()
        nmap_scanner = NmapScanner()

        scan_results = {}
        try:
            ping_results = nmap_scanner.scan(
                profile.ip_range, "ping"
            )  # TODO: make this configurable, because not all networks will need a two-step scan
            up_hosts = []
            if ping_results:

                nmap_hosts = ping_results["nmaprun"]["host"]
                for host in nmap_hosts:
                    if host["status"]["@state"] == "up":
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
                    scan_results = nmap_scanner.scan(concat_ips, "detailed")
                    if scan_results and "nmaprun" in scan_results:

                        nmap_parser = NMapParserService(scan_results, profile)

                        scan_event = nmap_parser.build_scan_event_from_results()
                        profile.scan_events.append(scan_event)
                        profile.last_scan = datetime.now()
                        self.db.add(profile)
                        self.db.commit()

        except Exception as e:
            logger.error(f"Error scanning profile {self.profile_id}: {e}")
            return

        # now let's scan the IP addresses that are "up"

        return profile

    def __process_scan_results(self, scan_results: dict) -> models.Profile:
        pass
