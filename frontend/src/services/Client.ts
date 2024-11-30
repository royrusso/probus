import { IPListToRange } from "../utils/IPUtils";

export const BASE_URI = import.meta.env.VITE_API_URL;

export const fetchPingData = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/ping/${ip_arg}`);
  const data = await response.json();
  return data;
};

export const fetchIPList = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/list/${ip_arg}`);
  const data = await response.json();
  return data;
};

const doFullScan = async (ip_arg: string) => {
  let ipList = fetchIPList(ip_arg);
  ipList.then((data) => {
    console.log("IP List: ", data);
    if (data.length === 0) {
      console.log("No IP Address found in the given range");
      return;
    }

    // get host IP object
    const hosts = data.result.nmaprun.host;

    console.log("Hosts: ", hosts);

    // divide hosts into chunks of 10 for parallel scanning
    const chunkSize = 10;
    const chunkedHosts = [];
    for (let i = 0; i < hosts.length; i += chunkSize) {
      chunkedHosts.push(hosts.slice(i, i + chunkSize));
    }

    console.log("Chunked Hosts: ", chunkedHosts);

    // for each chunk, convert the IP list to IP range and scan in parallel
    chunkedHosts.forEach((chunk: any) => {
      const ipRange = IPListToRange(
        chunk.map((host: any) => host.address["@addr"])
      );
      console.log("IP Range: ", ipRange);

      fetchPingData(ipRange).then((data) => {
        console.log("Ping Data: ", data);

        // Sometimes host is missing, if all IPs are down.
        if ("host" in data.result.nmaprun) {
          const hosts = data.result.nmaprun.host;

          // hosts can be an array, when multiple hosts are up. Otherwise, it's an object.
          if (hosts.isArray) {
            hosts.forEach((host: any) => {
              console.log("Host: ", host);
            });
          } else {
            console.log("Host: ", hosts);
          }
        }
      });
    });
  });
};

export default doFullScan;
