import axios from 'axios';

const axiosClient = axios.create({
    // Sử dụng biến môi trường lấy Base URL, hoặc fallback về localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho Request: Tự động đính kèm Token (nếu có) vào mọi Request gửi đi
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('tenant_token');
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
        // Với axios thông thường phải gọi response.data, 
        // ta chặn ở đây trả thẳng data ra cho gọn
        return response.data;
    },
    (error) => {
        // Xử lý các lỗi chung (VD: 401 Unauthorized -> Tự động đăng xuất)
        if (error.response?.status === 401) {
            // localStorage.removeItem('tenant_token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
