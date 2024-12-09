export const BASE_URI = import.meta.env.VITE_API_URL;

export const fetchPingData = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/ping/${ip_arg}`);
  const data = await response.json();
  return data;
};

export const fetchDetailedData = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/detailed/${ip_arg}`);
  const data = await response.json();
  return data;
};

export const fetchIPList = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/list/${ip_arg}`);
  const data = await response.json();
  return data;
};
