import axiosClient from './axiosClient';

const extractItems = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && Array.isArray(response.items)) {
        return response.items;
    }

    return [];
};

export const orderService = {
    // GET /api/tenants/{tenantId}/orders?customerId=uuid&status=Pending&page=1&pageSize=20
    getOrders: async (tenantId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await axiosClient.get(`/api/tenants/${tenantId}/orders${query ? `?${query}` : ''}`);
        return extractItems(response);
    },

    // GET /api/customer/orders
    getCustomerOrders: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await axiosClient.get(`/api/customer/orders${query ? `?${query}` : ''}`);
        return extractItems(response);
    },

    // POST /api/customer/orders/checkout
    checkout: async ({ address, paymentMethod }) => {
        return axiosClient.post('/api/customer/orders/checkout', {
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
