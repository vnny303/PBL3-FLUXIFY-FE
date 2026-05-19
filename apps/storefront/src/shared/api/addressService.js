import axiosClient from './axiosClient';

const unwrapData = (response) => response?.data ?? response;

const toAddressList = (response) => {
    const data = unwrapData(response);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

export const addressService = {
    // GET /api/customer/addresses
    getAddresses: async (tenantId, customerId) => {
        const response = await axiosClient.get('/api/customer/addresses');
        return { data: toAddressList(response) };
    },

    // POST /api/customer/addresses
    createAddress: async (tenantId, customerId, addressData) => {
        const response = await axiosClient.post('/api/customer/addresses', addressData);
        return { data: unwrapData(response) };
    },

    // PUT /api/customer/addresses/{addressId}
    updateAddress: async (tenantId, customerId, addressId, addressData) => {
        const response = await axiosClient.put(`/api/customer/addresses/${addressId}`, addressData);
        return { data: unwrapData(response) };
    },

    // DELETE /api/customer/addresses/{addressId}
    deleteAddress: async (tenantId, customerId, addressId) => {
        const response = await axiosClient.delete(`/api/customer/addresses/${addressId}`);
        return { data: unwrapData(response) };
    },
};
