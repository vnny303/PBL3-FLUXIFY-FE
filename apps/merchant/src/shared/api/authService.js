import { createAuthService } from '@fluxify/shared/api';
import { axiosClient } from './axiosClient';
import { AUTH_BASE_PATH } from './config';

const service = createAuthService(axiosClient, { authBasePath: AUTH_BASE_PATH });

export const authService = {
    loginMerchant: ({ email, password }) => service.loginMerchant({ email, password }),
    getCurrentUser: () => service.getCurrentUser(),
    getMyTenants: () => service.getMyTenants(),
    logout: () => service.logout(),
};
