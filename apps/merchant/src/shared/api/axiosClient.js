import { createApiClient } from '@fluxify/shared/api';
import { clearAuthSession, getToken } from '@fluxify/shared/lib';
import { API_BASE_URL } from './config';

const handleUnauthorized = () => {
    clearAuthSession();
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

export const axiosClient = createApiClient({
    baseURL: API_BASE_URL,
    getToken,
    onUnauthorized: handleUnauthorized,
    returnData: true,
});
