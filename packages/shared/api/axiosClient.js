import axios from 'axios';

// ==========================================
// CONFIGURATION DÙNG CHUNG
// ==========================================
const baseURL = import.meta.env?.VITE_API_URL || 'https://localhost:7112';
const baseHeaders = { 'Content-Type': 'application/json' };

// ==========================================
// 1. MERCHANT API CLIENT (Dành cho Admin Dashboard)
// ==========================================
export const merchantApiClient = axios.create({
  baseURL,
  headers: baseHeaders,
});

merchantApiClient.interceptors.request.use(
  (config) => {
    const merchantToken = localStorage.getItem('merchant_token');
    if (merchantToken) {
      config.headers.Authorization = `Bearer ${merchantToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

merchantApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('merchant_token');
      // Phát event thay vì hardcode '/login' vì context router của merchant có thể khác.
      // Tại Merchant App (App.jsx), lắng nghe event này để navigate về Login
      window.dispatchEvent(new CustomEvent('merchant_unauthorized'));
    }
    return Promise.reject(error);
  }
);

// ==========================================
// 2. STOREFRONT API CLIENT (Dành cho Customer App)
// ==========================================
export const storefrontApiClient = axios.create({
  baseURL,
  headers: baseHeaders,
});

storefrontApiClient.interceptors.request.use(
  (config) => {
    const customerToken = localStorage.getItem('customer_token');
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
    }

    const tenantId = localStorage.getItem('current_tenant_id');
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

storefrontApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_token');
      // Tương tự, để Storefront App tự quyết định hành động khi bị 401 (như hiện Modal login)
      window.dispatchEvent(new CustomEvent('customer_unauthorized'));
    }
    return Promise.reject(error);
  }
);