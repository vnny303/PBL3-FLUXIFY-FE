import axios from 'axios';
import { STORAGE_KEYS } from '../lib/constants';

const axiosClient = axios.create({
    // Sử dụng biến môi trường lấy Base URL, hoặc fallback về localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5119',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho Request: Tự động đính kèm Token (nếu có) vào mọi Request gửi đi
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho Response: Xử lý trước khi dữ liệu trả về component
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            const hadToken = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

            if (!hadToken) {
                return Promise.reject(error);
            }

            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
            localStorage.removeItem(STORAGE_KEYS.CUSTOMER_ID);
            localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
            localStorage.removeItem(STORAGE_KEYS.SUBDOMAIN);

            const isAuthPage =
                window.location.pathname === '/login' ||
                window.location.pathname === '/signup' ||
                window.location.pathname === '/merchant/login';
            if (!isAuthPage) {
                const isMerchantPath = window.location.pathname.startsWith('/merchant');
                window.location.href = isMerchantPath ? '/merchant/login' : '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
