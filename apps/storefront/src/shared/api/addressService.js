import axiosClient from './axiosClient';

export const addressService = {
    // GET /api/tenants/{tenantId}/customers/{customerId}/addresses
    getAddresses: async (tenantId, customerId) => {
        return await axiosClient.get(`/api/tenants/${tenantId}/customers/${customerId}/addresses`);
    },

    // POST /api/tenants/{tenantId}/customers/{customerId}/addresses
    createAddress: async (tenantId, customerId, addressData) => {
        return await axiosClient.post(`/api/tenants/${tenantId}/customers/${customerId}/addresses`, addressData);
    },

    // PUT /api/tenants/{tenantId}/customers/{customerId}/addresses/{addressId}
    updateAddress:      async (tenantId, customerId, addressId, addressData) => {
        return await axiosClient.put(`/api/tenants/${tenantId}/customers/${customerId}/addresses/${addressId}`, addressData);
    },

    // DELETE /api/tenants/{tenantId}/customers/{customerId}/addresses/{addressId}
    deleteAddress: async (tenantId, customerId, addressId) => {
        return await axiosClient.delete(`/api/tenants/${tenantId}/customers/${customerId}/addresses/${addressId}`);
    },
};
