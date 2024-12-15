from enum import Enum
import os
import subprocess
from loguru import logger
import xmltodict
import json
from sqlalchemy.orm import Session
from backend import models
from .nmap_utils import is_root


class ScanTypesEnum(str, Enum):
    PING = "ping"
    DETAILED = "detailed"
    OS = "os"
    LIST = "list"
    VULN = "vuln"


class NmapScanner(object):
    """
    Nmap object to handle nmap scanning. This will be used to scan the target IP address(es) and return the results.

    Speed is important, so this class will be used to scan multiple IP addresses in parallel. We will use the multiprocessing module to achieve this.

    In addition, we will scan in passes, going deeper with every pass.

    1. The first pass will be a simple ping scan to determine which hosts are up. "ping"
    2. The second pass will be a more detailed scan to determine the open ports and services. "detailed"
    3. The third pass will be a vulnerability scan to determine which hosts are vulnerable. "vuln"
    """

    def __init__(self):
        self.target = []  # Target IP address(es) to scan because we want to run these in batches.
        self.scan_type = "ping"  # The type of scan to perform

    def which_nmap(self) -> str:
        """Find nmap in the system. We will likely be distributing this as a docker container, so we do have some control over the OS and nmap installation."""
        for path in os.environ["PATH"].split(os.pathsep):
            path = path.strip('"')
            nmap = os.path.join(path, "nmap")
            if os.path.isfile(nmap) and os.access(nmap, os.X_OK):
                return nmap
        return None

    def nmap_version(self) -> str:
        """Get the version of nmap installed on the system."""
        nmap_path = self.which_nmap()
        if nmap_path:
            command = [nmap_path, "--version"]
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            try:
                stdout, stderr = process.communicate(timeout=10)
                """
                Output looks like this:
                Nmap version 7.95 ( https://nmap.org )
                Platform: arm-apple-darwin23.4.0
                Compiled with: liblua-5.4.6 openssl-3.3.2 libssh2-1.11.0 libz-1.2.12 libpcre2-10.44 nmap-libpcap-1.10.4 nmap-libdnet-1.12 ipv6
                """
                for line in stdout.decode("utf-8").split("\n"):
                    if "Nmap version" in line:
                        version = line.split(" ")[2]
                        logger.info("Nmap version: {}".format(version))
                        return version
                # return stdout.decode("utf-8")
            except subprocess.TimeoutExpired:
                process.kill()
                stdout, stderr = process.communicate()
                return stdout.decode("utf-8")
        return None

    def get_scan_command(self):
        """
        Get the nmap command to run based on the scan type.

        HOST DISCOVERY:
        -sn (No port scan)
        -Pn (Port scan only, No host discovery)
        --traceroute (Trace the route to the host)

        PORT SPECIFICATION AND TECHNIQUES:
        -F (Fast scan)
        -sS (TCP SYN scan)
        -sT (TCP connect scan)
        --min-rate (Send packets no slower than <number> per second)
        -T4 (Aggressive timing template)

        SERVICE/VERSION DETECTION:
        -sV (Probe open ports to determine service/version info)
        -O (Enable OS detection)
        --script (Run a script scan using the default set of scripts)

        OUTPUT:
        -oX (Output scan in XML format)
        -oN (Output scan in normal format)

        TESTING:
        -v (Increase verbosity level)
        "-p", "121314141" (will trigger an error)
        """
        nmap_path = self.which_nmap()
        if nmap_path:
            match self.scan_type:
                case (
                    ScanTypesEnum.PING
                ):  # No port scan. Yes traceroute sudo nmap -sn --traceroute -T4 -oX - -v 192.168.1.196
                    flags = [
                        "-sn",
                        "-T4",
                        "-oX",
                        "-",
                    ]
                case ScanTypesEnum.DETAILED:  # TCP SYN scan nmap -sS --min-rate 2000 -oX -
                    flags = ["-sS", "--min-rate", "2000", "-oX", "-"]
                case ScanTypesEnum.OS:  # Enable OS detection only
                    flags = ["-sS", "-O", "--min-rate", "2000", "-oX", "-"]
                case ScanTypesEnum.LIST:  # List scan sudo nmap -sL 192.168.1.200-210
                    flags = ["-sL", "-oX", "-"]
                case ScanTypesEnum.VULN:  # Probe open ports to determine service/version info and vuln scan
                    # nmap --script vulners -sV -O --min-rate 2000 -oX -
                    flags = [
                        "--script",
                        "vulners",
                        "-sV",
                        "-O",
                        "--min-rate",
                        "2000",
                        "-oX",
                        "-",
                    ]  # Probe open ports to determine service/version info and vuln scan
                    # TODO: consider adding --script-args mincvss=6.5
                # When using any of the bulk scans, the results can become overwhelming and some users will want to exclude low CVSS score vulnerabilities.
                # To only show vulnerabilities within a certain range, add the following flag to the command where “x.x” is the CVSS score (ex: 6.5).
                case _:
                    flags = []  # just use ping as the default.
            command = [nmap_path] + flags + [self.target]
            return command
        return None

    def list_scan(self, target: str) -> str:
        """
        Given an IP address range, returns the IP addresses in the range. This does NOT check the status, scan, nor ping each IP.

        From the Nmap documentation:

        https://nmap.org/book/man-host-discovery.html

        > The list scan is a degenerate form of host discovery that simply lists each host of the network(s) specified, without sending any packets to the target hosts. By default, Nmap still does reverse-DNS resolution on the hosts to learn their names. It is often surprising how much useful information simple hostnames give out. For example, fw.chi is the name of one company's Chicago firewall. Nmap also reports the total number of IP addresses at the end. The list scan is a good sanity check to ensure that you have proper IP addresses for your targets. If the hosts sport domain names you do not recognize, it is worth investigating further to prevent scanning the wrong company's network.
        Since the idea is to simply print a list of target hosts, options for higher level functionality such as port scanning, OS detection, or host discovery cannot be combined with this. If you wish to disable host discovery while still performing such higher level functionality, read up on the -Pn (skip host discovery) option.

        """
        self.target = target
        self.scan_type = "list"
        return self.__scan()

    @is_root
    def scan_profile(self, profile_id: str, db: Session) -> str:
        """
        Given a profile ID, scan the target IP address(es) and return the results.
        """
        profile = db.query(models.Profile).filter(models.Profile.profile_id == profile_id).first()
        if not profile:
            logger.error("Profile not found.")
            return None

        # get the target IP address(es) from the profile
        self.target = profile.ip_range
        self.scan_type = "detailed"
        if not self.target or not self.scan_type:
            logger.error("Target and scan type must be provided.")
            return "Target and scan type must be provided."

        # scan the target IP address(es)
        scan_result_xml = self.__scan()

        return scan_result_xml

    @is_root
    def scan(self, target: str, type: str) -> str:
        # Rethinking this...
        # if ("-" in target) or ("/" in target):
        #     logger.error(
        #         "Target {} must be a single IP address. Use list_scan instead.".format(
        #             target
        #         )
        #     )
        #     return "Target {} must be a single IP address.".format(target)

        self.target = target
        self.scan_type = type
        if not self.target or not self.scan_type:
            logger.error("Target and scan type must be provided.")
            return "Target and scan type must be provided."
        return self.__scan()

    @is_root
    def __scan(self) -> str:
        """
        Scan the target IP address(es)
        ::NOTE:: This requires root privs, so when running in VSCode Debugger, open the vscode terminal and type: `sudo su` and then run the debugger.
        """
        if not self.target:
            return "No target to scan."

        command = self.get_scan_command()
        logger.info("Running command: {}".format(" ".join(command)))
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            stdout, stderr = process.communicate(timeout=300)  # TODO: timeout should be configurable
            # logger.info("Scan Results: {}".format(stdout.decode("utf-8")))
            json_stdout_response = json.dumps(xmltodict.parse(stdout.decode("utf-8")), indent=4)

            logger.info("Scan Results: {}".format(json_stdout_response))
            if stderr:
                logger.error("Scan Errors: {}".format(stderr.decode("utf-8")))
            return json.loads(json_stdout_response)
        except subprocess.TimeoutExpired:
            process.kill()
            logger.error("Scan timed out for target: {}".format(self.target))
            return None
        except Exception as e:
            logger.error("Error: {}".format(e))
            return None


if __name__ == "__main__":
    nmap_scanner = NmapScanner()
    nmap_scanner.nmap_version()

    nmap_scanner.scan_type = "ping"
    nmap_scanner.scan("192.168.1.196", "ping")

    nmap_scanner.scan("192.168.1.196", "detailed")

    nmap_scanner.scan("192.168.1.0/24", "ping")

    nmap_scanner.list_scan("192.168.1.0/24")
