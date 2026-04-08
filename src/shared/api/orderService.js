import axiosClient from './axiosClient';

export const orderService = {
    // GET /api/tenants/{tenantId}/orders?customerId=uuid&status=Pending&page=1&pageSize=20
    getOrders: async (tenantId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        return await axiosClient.get(`/api/tenants/${tenantId}/orders${query ? `?${query}` : ''}`);
    },

    // GET /api/tenants/{tenantId}/customers/{customerId}/orders
    getCustomerOrders: async (tenantId, customerId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        return await axiosClient.get(`/api/tenants/${tenantId}/customers/${customerId}/orders${query ? `?${query}` : ''}`);
    },

    // POST /api/tenants/{tenantId}/customers/{customerId}/checkout
    checkout: async (tenantId, customerId, { address, paymentMethod }) => {
        return await axiosClient.post(`/api/tenants/${tenantId}/customers/${customerId}/checkout`, {
            address,
            paymentMethod,
        });
    },

    // PUT /api/tenants/{tenantId}/orders/{id}/status
    updateOrderStatus: async (tenantId, orderId, { status }) => {
        return await axiosClient.put(`/api/tenants/${tenantId}/orders/${orderId}/status`, {
            status,
        });
    },
};
