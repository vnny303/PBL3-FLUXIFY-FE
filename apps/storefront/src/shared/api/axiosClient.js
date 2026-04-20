import { createApiClient } from '@fluxify/shared/api';
import { clearAuthSession, getToken } from '@fluxify/shared/lib';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5119';

const handleUnauthorized = () => {
    clearAuthSession();
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

//Luat tao API
const axiosClient = createApiClient({
    baseURL: API_BASE_URL,
    getToken,
    onUnauthorized: handleUnauthorized,
    returnData: true,
});

export default axiosClient;

// import axios from 'axios';
// import { API_BASE_URL } from './config';

// const TOKEN_KEY = 'token';

// export const axiosClient = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Tự động gắn Bearer token vào mọi request nếu localStorage đang có token
// axiosClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem(TOKEN_KEY);

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Nếu backend trả 401 thì coi như session local không còn hợp lệ
// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem(TOKEN_KEY);
//             localStorage.removeItem('user');
//             localStorage.removeItem('currentTenant');
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosClient;