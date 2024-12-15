export const BASE_URI = import.meta.env.VITE_API_URL;

export const createProfile = async (profileData: any) => {
  const response = await fetch(`${BASE_URI}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  return data;
};

export const fetchProfile = async (profileId: string) => {
  const response = await fetch(`${BASE_URI}/profile/${profileId}`);
  const data = await response.json();
  return data;
};

export const fetchProfileList = async () => {
  const response = await fetch(`${BASE_URI}/profiles`);
  const data = await response.json();
  return data;
};

export const updateProfile = async (profileId: string, profileData: any) => {
  const response = await fetch(`${BASE_URI}/profile/${profileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  return data;
};

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
