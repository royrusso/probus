import traceback
from typing import List

from loguru import logger
from backend.models import Address, Host, HostName, Port, Profile, ScanEvent


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
        scan_event.scan_summary = self.scan_results["nmaprun"]["runstats"]["finished"]["@summary"]

        hosts: List[Host] = []
        host_list = self.scan_results["nmaprun"]["host"]
        for host in host_list:
            if isinstance(host, str):
                logger.warning(f"Host is a string: {host}")
                continue
            try:
                host_obj = Host()
                host_obj.start_time = host.get("@starttime", None)
                host_obj.end_time = host.get("@endtime", None)
                host_status = host.get("status", "UNKNOWN")
                if host_status:
                    host_obj.state = host_status.get("@state", None)
                    host_obj.reason = host_status.get("@reason", None)
                host_obj.latency = host.get("times", {}).get("@srtt", None)

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

                hostname = host.get("hostnames", None)
                if hostname:
                    if isinstance(hostname, dict):
                        host_name = HostName()
                        host_name.host_name = hostname["hostname"]["@name"]
                        host_name.host_type = hostname.get("hostname", {}).get("@type", None)
                        host_obj.hostnames.append(host_name)
                    elif isinstance(hostname, list):
                        for hn in hostname:
                            host_name = HostName()
                            host_name.host_name = hn["hostname"]["@name"]
                            host_name.host_type = hn.get("hostname", {}).get("@type", None)
                            host_obj.hostnames.append(host_name)

                ports = host.get("ports", None)
                if ports:
                    found_ports = ports.get("port", [])
                    if found_ports:
                        if isinstance(found_ports, list):
                            for p in found_ports:
                                port = Port()
                                port.port_number = p["@portid"]
                                port.protocol = p["@protocol"]
                                port.state = p["state"]["@state"]
                                port.reason = p["state"].get("@reason", None)
                                port.service = p.get("service", {}).get("@name", None)
                                host_obj.ports.append(port)
                        elif isinstance(found_ports, dict):
                            port = Port()
                            port.port_number = found_ports["@portid"]
                            port.protocol = found_ports["@protocol"]
                            port.state = found_ports["state"]["@state"]
                            port.reason = found_ports["state"].get("@reason", None)
                            port.service = found_ports.get("service", {}).get("@name", None)
                            host_obj.ports.append(port)

                hosts.append(host_obj)
            except Exception as e:
                logger.error(f"Error parsing host for profile {self.profile.profile_id}: {e}")
                traceback.print_exc()

        scan_event.hosts = hosts

        return scan_event
