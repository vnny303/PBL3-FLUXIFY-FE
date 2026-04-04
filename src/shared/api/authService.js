import axiosClient from './axiosClient';
import { API_CONFIG } from '../lib/constants';
import { unwrapApiData } from '../lib/api';

const AUTH_PREFIX = API_CONFIG.AUTH_PREFIX;

export const authService = {
    registerCustomer: async (payload) => {
        const response = await axiosClient.post(`${AUTH_PREFIX}/customer/register`, payload);
        return unwrapApiData(response);
    },

    loginCustomer: async (payload) => {
        const subdomain = payload?.subdomain || payload?.Subdomain || '';
        const query = subdomain ? `?subdomain=${encodeURIComponent(subdomain)}` : '';
        // Compat mode: send subdomain in BOTH query and body.
        // - Current BE expects query.
        // - API spec expects body.
        const response = await axiosClient.post(`${AUTH_PREFIX}/customer/login${query}`, payload);
        return unwrapApiData(response);
    },

    loginMerchant: async (payload) => {
        const response = await axiosClient.post(`${AUTH_PREFIX}/merchant/login`, payload);
        return unwrapApiData(response);
    },

    logout: async () => {
        const response = await axiosClient.post(`${AUTH_PREFIX}/logout`);
        return unwrapApiData(response);
    },

    getCurrentUser: async () => {
        const response = await axiosClient.get(`${AUTH_PREFIX}/me`);
        return unwrapApiData(response);
    }
};
