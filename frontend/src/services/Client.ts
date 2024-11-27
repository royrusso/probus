export const BASE_URI = import.meta.env.VITE_API_URL;

export const scanListType = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/list/${ip_arg}`);
  const data = await response.json();
  return data;
};

export const scanPingType = async (ip_arg: string) => {
  const response = await fetch(`${BASE_URI}/scan/ping/${ip_arg}`);
  const data = await response.json();
  return data;
};
