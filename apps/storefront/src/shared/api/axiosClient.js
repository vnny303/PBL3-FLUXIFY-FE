import { createApiClient } from '@fluxify/shared/api';
import { clearAuthSession, getToken } from '@fluxify/shared/lib';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5119';

const handleUnauthorized = () => {
    clearAuthSession();
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

const axiosClient = createApiClient({
    baseURL: API_BASE_URL,
    getToken,
    onUnauthorized: handleUnauthorized,
    returnData: true,
});

export default axiosClient;
