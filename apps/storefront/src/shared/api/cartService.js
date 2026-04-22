import axiosClient from './axiosClient';

export const cartService = {
    // GET /api/Cart
    getCart: async (tenantId, customerId) => {
        return axiosClient.get(`/api/Cart`);
    },

    // POST /api/Cart/items
    addToCart: async (tenantId, customerId, { productSkuId, quantity }) => {
        return axiosClient.post(`/api/Cart/items`, {
            productSkuId,
            quantity,
        });
    },

    // PUT /api/Cart/items/{itemId}
    updateCartItem: async (tenantId, customerId, itemId, { quantity }) => {
        return axiosClient.put(`/api/Cart/items/${itemId}`, {
            quantity,
        });
    },

    // DELETE /api/Cart/items/{itemId}
    removeFromCart: async (tenantId, customerId, itemId) => {
        return axiosClient.delete(`/api/Cart/items/${itemId}`);
    },

    // DELETE /api/Cart/items
    clearCart: async (tenantId, customerId) => {
        return axiosClient.delete(`/api/Cart/items`);
    },
};
