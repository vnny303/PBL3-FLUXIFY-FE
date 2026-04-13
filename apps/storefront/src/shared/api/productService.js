import axiosClient from './axiosClient';

export const productService = {
    // GET /api/tenants/{tenantId}/products?categoryId=uuid&page=1&pageSize=20
    getProducts: async (tenantId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        return await axiosClient.get(`/api/tenants/${tenantId}/products${query ? `?${query}` : ''}`);
    },

    // GET /api/tenants/{tenantId}/products/{id}
    getProductById: async (tenantId, productId) => {
        return await axiosClient.get(`/api/tenants/${tenantId}/products/${productId}`);
    },

    // GET /api/tenants/{tenantId}/categories
    getCategories: async (tenantId) => {
        return await axiosClient.get(`/api/tenants/${tenantId}/categories`);
    },
};
