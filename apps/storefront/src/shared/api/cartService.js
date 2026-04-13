import axiosClient from './axiosClient';

export const cartService = {
    // GET /api/tenants/{tenantId}/customers/{customerId}/cart
    getCart: async (tenantId, customerId) => {
        return await axiosClient.get(`/api/tenants/${tenantId}/customers/${customerId}/cart`);
    },

    // POST /api/tenants/{tenantId}/customers/{customerId}/cart/items
    addToCart: async (tenantId, customerId, { productSkuId, quantity }) => {
        return await axiosClient.post(`/api/tenants/${tenantId}/customers/${customerId}/cart/items`, {
            productSkuId,
            quantity,
        });
    },

    // PUT /api/tenants/{tenantId}/customers/{customerId}/cart/items/{itemId}
    updateCartItem: async (tenantId, customerId, itemId, { quantity }) => {
        return await axiosClient.put(`/api/tenants/${tenantId}/customers/${customerId}/cart/items/${itemId}`, {
            quantity,
        });
    },

    // DELETE /api/tenants/{tenantId}/customers/{customerId}/cart/items/{itemId}
    removeFromCart: async (tenantId, customerId, itemId) => {
        return await axiosClient.delete(`/api/tenants/${tenantId}/customers/${customerId}/cart/items/${itemId}`);
    },

    // DELETE /api/tenants/{tenantId}/customers/{customerId}/cart/items
    clearCart: async (tenantId, customerId) => {
        return await axiosClient.delete(`/api/tenants/${tenantId}/customers/${customerId}/cart/items`);
    },
};
