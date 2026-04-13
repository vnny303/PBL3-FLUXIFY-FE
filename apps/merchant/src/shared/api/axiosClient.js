import axios from 'axios';
import { API_BASE_URL } from './config';

export const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for Requests
axiosClient.interceptors.request.use(
    (config) => {
        // You can attach tokens here
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers['Authorization'] = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for Responses
axiosClient.interceptors.response.use(
    (response) => {
        // Return only the data portion directly
        return response.data;
    },
    (error) => {
        // Handle global error codes here (e.g., 401 Unauthorized -> redirect)
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);
