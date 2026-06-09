import { createApiClient, createMockAdapter, seedMockBrowserSession } from '@fluxify/shared/api';
import { clearAuthSession, getToken } from '@fluxify/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5119/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

if (USE_MOCK_DATA) {
    seedMockBrowserSession();
}

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
    returnData: false,
    adapter: USE_MOCK_DATA ? createMockAdapter() : undefined,
});

export default axiosClient;
