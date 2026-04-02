import axiosClient from './axiosClient';

// BIẾN MÔ PHỎNG: Chuyển thành false khi đã có Backend nối vào
const MOCK_API = true;

export const authService = {
    registerCustomer: async (payload) => {
        if (MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { message: "Account created successfully", ...payload };
        }
        // Khi có thật, mã chỉ còn 1 dòng rất gọn
        return await axiosClient.post('/api/simpleauth/customer/register', payload);
    },

    loginCustomer: async (payload) => {
        if (MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            return {
                message: "Login successful",
                token: "fake-jwt-token-123xyz...",
                user: { email: payload.Email }
            };
        }
        return await axiosClient.post('/api/simpleauth/customer/login', payload);
    },

    logout: async () => {
        if (MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { message: "Logged out" };
        }
        return await axiosClient.post('/api/simpleauth/logout');
    },

    getCurrentUser: async () => {
        if (MOCK_API) {
            await new Promise(resolve => setTimeout(resolve, 800));
            return { email: "mock@user.com", tenantId: "MockTenant" };
        }
        return await axiosClient.get('/api/simpleauth/me');
    }
};
