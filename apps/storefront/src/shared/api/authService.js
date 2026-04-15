import { createAuthService } from '@fluxify/shared/api';
import axiosClient from './axiosClient';

const authBasePath = import.meta.env.VITE_AUTH_BASE_PATH || '/api/auth';
const service = createAuthService(axiosClient, { authBasePath });

export const authService = {
    registerCustomer: async ({ subdomain, email, password }) =>
        service.registerCustomer({ subdomain, email, password }),

    loginCustomer: async ({ subdomain, email, password }) =>
        service.loginCustomer({ subdomain, email, password }),

    logout: async () => service.logout(),

    getCurrentUser: async () => service.getCurrentUser(),

    getTenantBySubdomain: async (subdomain) => service.getTenantBySubdomain(subdomain),
};
