
import os
import subprocess
from loguru import logger
import xmltodict
import json
from nmap_utils import is_root

class Nmap(object):
    """
    Nmap object to handle nmap scanning. This will be used to scan the target IP address(es) and return the results.

    Speed is important, so this class will be used to scan multiple IP addresses in parallel. We will use the multiprocessing module to achieve this.

    In addition, we will scan in passes, going deeper with every pass. 
    
    1. The first pass will be a simple ping scan to determine which hosts are up. 
    2. The second pass will be a more detailed scan to determine the open ports and services. 
    3. The third pass will be a vulnerability scan to determine which hosts are vulnerable.
    """

    def __init__(self, path=None):
        self.target = [] # Target IP address(es) to scan
        self.nmap_path = path if path else self.which_nmap()
        self.scan_type = "ping" # The type of scan to perform

    def which_nmap(self):
        """Find nmap in the system. We will likely be distributing this as a docker container, so we do have some control over the OS and nmap installation."""
        for path in os.environ["PATH"].split(os.pathsep):
            path = path.strip('"')
            nmap = os.path.join(path, "nmap")
            if os.path.isfile(nmap) and os.access(nmap, os.X_OK):
                return nmap
        return None

    def nmap_version(self):
        """Get the version of nmap installed on the system."""
        nmap_path = self.which_nmap()
        if nmap_path:
            command = [nmap_path, "--version"]
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            try:
                stdout, stderr = process.communicate(timeout=10)
                """
                Nmap version 7.95 ( https://nmap.org )
                Platform: arm-apple-darwin23.4.0
                Compiled with: liblua-5.4.6 openssl-3.3.2 libssh2-1.11.0 libz-1.2.12 libpcre2-10.44 nmap-libpcap-1.10.4 nmap-libdnet-1.12 ipv6
                """
                for line in stdout.decode("utf-8").split("\n"):
                    if "Nmap version" in line:
                        version = line.split(" ")[2]    
                        logger.info("Nmap version: {}".format(version))
                        return version
                #return stdout.decode("utf-8")
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
        -Pn (No host discovery)
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
            if self.scan_type == "ping":
                flags = ["-sn", "-Pn", "--traceroute", "-T4", "-oX", "-"] # No port scan. Yes traceroute
            elif self.scan_type == "detailed":
                flags = ["-sS", "--min-rate", "2000", "-oX", "-"] # TCP SYN scan
            elif self.scan_type == "vuln":
                flags = ["--script", "vulners", "-sV", "-O","--min-rate", "2000", "-oX", "-"] # Probe open ports to determine service/version info and vuln scan

            command = [nmap_path] + flags + [self.target]
            return command
        return None

    @is_root
    def scan(self):
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
            stdout, stderr = process.communicate(timeout=30) # TODO: timeout should be configurable
            #logger.info("Scan Results: {}".format(stdout.decode("utf-8")))
            json_stdout_response = json.dumps(xmltodict.parse(stdout.decode("utf-8")), indent=4)
            logger.info("Scan Results: {}".format(json_stdout_response))
            if stderr:
                logger.error("Scan Errors: {}".format(stderr.decode("utf-8")))
            return stdout.decode("utf-8")
        except subprocess.TimeoutExpired:
            process.kill()
            logger.error("Scan timed out for target: {}".format(self.target))
            return None
        except Exception as e:
            logger.error("Error: {}".format(e))
            return None

if __name__ == "__main__":
    nmap = Nmap()
    nmap.nmap_version()

    #nmap.target = "192.168.50.140-144"
    #nmap.target = "192.168.20.51-58"
    #nmap.target = "192.168.20.51"
    nmap.target = "192.168.1.196"
    #nmap.target = "192.168.1.180"
    nmap.scan_type = "ping"
    nmap.scan()

    nmap.scan_type = "detailed"
    nmap.scan()

    # nmap.scan_type = "vuln"
    # nmap.scan()
