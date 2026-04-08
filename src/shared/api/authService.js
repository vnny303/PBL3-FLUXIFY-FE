import axiosClient from './axiosClient';

export const authService = {
    registerCustomer: async (payload) => {
        return await axiosClient.post('/api/auth/customer/register', payload);
    },

    loginCustomer: async (payload) => {
        return await axiosClient.post('/api/auth/customer/login', payload);
    },

    logout: async () => {
        return await axiosClient.post('/api/auth/logout');
    },

    getCurrentUser: async () => {
        return await axiosClient.get('/api/auth/me');
    }
};
