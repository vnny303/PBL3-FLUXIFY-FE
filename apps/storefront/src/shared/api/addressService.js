import axiosClient from './axiosClient';

import { INITIAL_ADDRESS_MOCKS } from '../lib/mocks/addressMock';

const IS_MOCK = import.meta.env.VITE_ENABLE_CUSTOMER_ADDRESSES_MOCK === 'true';
const STORAGE_KEY = 'fluxify_customer_addresses';

const getMockAddresses = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        saveMockAddresses(INITIAL_ADDRESS_MOCKS);
        return INITIAL_ADDRESS_MOCKS;
    }
    return JSON.parse(data);
};

const saveMockAddresses = (addresses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
};

export const addressService = {
    // GET /api/tenants/{tenantId}/customers/{customerId}/addresses
    getAddresses: async (tenantId, customerId) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            // In mock mode, we might just return all for simplicity or filter by customerId if available
            const filtered = customerId ? all.filter(a => a.customerId === customerId || a.customerId === null) : all;
            return { data: filtered };
        }
        return await axiosClient.get(`/api/tenants/${tenantId}/customers/${customerId}/addresses`);
    },

    // POST /api/tenants/{tenantId}/customers/{customerId}/addresses
    createAddress: async (tenantId, customerId, addressData) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            const newAddress = {
                ...addressData,
                id: crypto.randomUUID(),
                customerId,
                tenantId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            if (newAddress.isDefault) {
                all.forEach(a => { if (a.customerId === customerId || a.customerId === null) a.isDefault = false; });
            } else if (all.filter(a => a.customerId === customerId || a.customerId === null).length === 0) {
                newAddress.isDefault = true;
            }

            all.push(newAddress);
            saveMockAddresses(all);
            return { data: newAddress };
        }
        return await axiosClient.post(`/api/tenants/${tenantId}/customers/${customerId}/addresses`, addressData);
    },

    // PUT /api/tenants/{tenantId}/customers/{customerId}/addresses/{addressId}
    updateAddress: async (tenantId, customerId, addressId, addressData) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            const idx = all.findIndex(a => a.id === addressId);
            if (idx === -1) throw new Error('Address not found');

            if (addressData.isDefault) {
                all.forEach(a => { if (a.customerId === customerId || a.customerId === null) a.isDefault = false; });
            }

            all[idx] = { 
                ...all[idx], 
                ...addressData, 
                updatedAt: new Date().toISOString() 
            };
            saveMockAddresses(all);
            return { data: all[idx] };
        }
        return await axiosClient.put(`/api/tenants/${tenantId}/customers/${customerId}/addresses/${addressId}`, addressData);
    },

    // DELETE /api/tenants/{tenantId}/customers/{customerId}/addresses/{addressId}
    deleteAddress: async (tenantId, customerId, addressId) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            const filtered = all.filter(a => a.id !== addressId);
            saveMockAddresses(filtered);
            return { data: { success: true } };
        }
        return await axiosClient.delete(`/api/tenants/${tenantId}/customers/${customerId}/addresses/${addressId}`);
    },
};
