//Call API

import axiosClient from "./axiosClient";
import {
  clearAuthSession,
} from "@fluxify/shared/lib";

export const getTenantBySubdomain = async (subdomain) => {
  return axiosClient.get(
    `/api/tenants/subdomain/${encodeURIComponent(subdomain)}`
  );
};

export const registerCustomer = async ({ email, password, subdomain }) => {
  return axiosClient.post(
    `/api/auth/customer/register?subdomain=${encodeURIComponent(subdomain)}`,
    {
      email,
      password,
    }
  );
};

export const loginCustomer = async ({ email, password, subdomain }) => {
  return axiosClient.post(
    `/api/auth/customer/login?subdomain=${encodeURIComponent(subdomain)}`,
    {
      email,
      password,
      subdomain
    }
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
  return axiosClient.put(`/api/auth/customers/${customerId}`, data);
};

export const authService = {
  registerCustomer,
  loginCustomer,
  logout,
  getCurrentUser,
  getTenantBySubdomain,
  updateCustomer,
};