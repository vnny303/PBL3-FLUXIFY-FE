import axiosClient from "./axiosClient";
import { clearAuthSession } from "@fluxify/shared/lib";

const IS_MOCK_AVATAR = import.meta.env.VITE_ENABLE_AUTH_AVATAR_MOCK === 'true';

export const getTenantBySubdomain = async (subdomain) => {
  return axiosClient.get(
    `/api/tenants/subdomain/${encodeURIComponent(subdomain)}`
  );
};

export const registerCustomer = async ({ email, password, subdomain }) => {
  return axiosClient.post(
    `/api/auth/customer/register?subdomain=${encodeURIComponent(subdomain)}`,
    { email, password }
  );
};

export const loginCustomer = async ({ email, password, subdomain }) => {
  return axiosClient.post(
    `/api/auth/customer/login?subdomain=${encodeURIComponent(subdomain)}`,
    { email, password, subdomain }
  );
};

export const getCurrentUser = async () => {
  return axiosClient.get("/api/auth/me");
};

export const logout = async () => {
  try {
    await axiosClient.post("/api/auth/logout");
  } finally {
    clearAuthSession();
  }
};

export const updateCustomer = async (customerId, data) => {
  return axiosClient.put(`/api/auth/customer/${customerId}`, data);
};

export const uploadAvatar = async (customerId, file) => {
  if (IS_MOCK_AVATAR) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAvatarUrl = URL.createObjectURL(file);
        resolve({ avatarUrl: mockAvatarUrl });
      }, 1500);
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosClient.post(`/api/auth/customer/${customerId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response?.data ?? response;
};

export const authService = {
  registerCustomer,
  loginCustomer,
  logout,
  getCurrentUser,
  getTenantBySubdomain,
  updateCustomer,
  uploadAvatar,
};