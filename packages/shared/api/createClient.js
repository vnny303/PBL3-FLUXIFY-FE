import axios from "axios";

export const createApiClient = ({
  baseURL,
  getToken,
  onUnauthorized,
  returnData = true,
}) => {
  const instance = axios.create({
    baseURL,
    headers: {
    "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (res) => (returnData ? res.data : res),
    (err) => {
      if (err.response?.status === 401) {
        onUnauthorized?.();
      }
      return Promise.reject(err);
    }
  );

  return instance;
};