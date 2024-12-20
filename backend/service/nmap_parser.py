from typing import List

from loguru import logger
from backend.models import Address, Host, Profile, ScanEvent


class NMapParserService(object):
    """
    An attempt at a service that can centralize nmap parsing, so ONE `ScanEvent` can be created from the scan results.
    """

    def __init__(self, scan_results: dict = None, profile: Profile = None):
        self.scan_results = scan_results
        self.profile = profile

    def build_scan_event_from_results(self) -> ScanEvent:

        scan_event = ScanEvent()
        scan_event.profile_id = self.profile.profile_id
        scan_event.profile = self.profile
        scan_event.scan_command = self.scan_results["nmaprun"]["@args"]
        scan_event.scan_start = self.scan_results["nmaprun"]["@start"]
        scan_event.scan_end = self.scan_results["nmaprun"]["runstats"]["finished"]["@time"]
        scan_event.scan_status = self.scan_results["nmaprun"]["runstats"]["finished"]["@exit"]

        hosts: List[Host] = []
        host_list = self.scan_results["nmaprun"]["host"]
        for host in host_list:
            try:
                host_obj = Host()
                host_obj.start_time = host.get("@starttime", None)
                host_obj.end_time = host.get("@endtime", None)
                host_status = host.get("status", "UNKNOWN")
                if host_status:
                    host_obj.state = host_status.get("@state", None)
                    host_obj.reason = host_status.get("@reason", None)

                address = host["address"]
                if address:
                    if isinstance(address, dict):
                        host_address = Address()
                        host_address.address_type = address.get("@addrtype", None)
                        host_address.address = address["@addr"]
                        host_address.vendor = address.get("@vendor", None)
                        host_obj.addresses.append(host_address)
                    elif isinstance(address, list):
                        for addr in address:
                            host_address = Address()
                            host_address.address_type = addr.get("@addrtype", None)
                            host_address.address = addr["@addr"]
                            host_address.vendor = addr.get("@vendor", None)
                            host_obj.addresses.append(host_address)
                hosts.append(host_obj)
            except Exception as e:
                logger.error(f"Error parsing host for profile {self.profile.profile_id}: {e}")

        scan_event.hosts = hosts

        return scan_event
