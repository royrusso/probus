// Function to convert a range of IP addresses to a list of IP addresses
// Abandon all hope, ye who enter here
export const IPListToRange = (ipList: string[]): string => {
  let ipRange: string;

  if (ipList.length === 0) {
    return "";
  }

  const sortedIPList = ipList
    .map((ip) => {
      return ip.split(".").map((octet) => {
        return parseInt(octet);
      });
    })
    .sort((a, b) => {
      return a[0] - b[0] || a[1] - b[1] || a[2] - b[2] || a[3] - b[3];
    });

  const baseIP = sortedIPList[0].slice(0, 3).join("."); // get the base IP - first three octets
  let startIP = sortedIPList[0][3]; // get the start IP - last octet
  let endIP = sortedIPList[sortedIPList.length - 1][3]; // get the end IP - last octet

  ipRange = `${baseIP}.${startIP}-${endIP}`;

  return ipRange;
};
