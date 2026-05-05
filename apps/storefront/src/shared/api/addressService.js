import axiosClient from './axiosClient';

import { INITIAL_ADDRESS_MOCKS } from '../lib/mocks/addressMock';

const IS_MOCK = import.meta.env.VITE_ENABLE_CUSTOMER_ADDRESSES_MOCK === 'true';
const STORAGE_KEY = 'fluxify_customer_addresses';
const unwrapData = (response) => response?.data ?? response;
const toAddressList = (response) => {
    const data = unwrapData(response);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const MOCK_ID_PREFIX = 'mock-address-';

const isUuidLike = (value) => (
    typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
);

const normalizeMockAddress = (address, index) => {
    const fallbackId = `${MOCK_ID_PREFIX}${index + 1}`;
    const safeId = typeof address?.id === 'string' && address.id.trim() ? address.id.trim() : fallbackId;
    return {
        ...address,
        id: isUuidLike(safeId) ? fallbackId : safeId,
        isMock: true,
    };
};

const buildNextMockAddressId = (addresses = []) => {
    const usedNumbers = new Set(
        addresses
            .map((item) => {
                const id = typeof item?.id === 'string' ? item.id : '';
                const match = id.match(/^mock-address-(\d+)$/);
                return match ? Number(match[1]) : null;
            })
            .filter((value) => Number.isFinite(value) && value > 0)
    );

    let cursor = 1;
    while (usedNumbers.has(cursor)) {
        cursor += 1;
    }
    return `${MOCK_ID_PREFIX}${cursor}`;
};

const getMockAddresses = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        const normalizedInitial = INITIAL_ADDRESS_MOCKS.map(normalizeMockAddress);
        saveMockAddresses(normalizedInitial);
        return normalizedInitial;
    }
    let parsed = null;
    try {
        parsed = JSON.parse(data);
    } catch {
        parsed = null;
    }
    if (!Array.isArray(parsed)) {
        const normalizedInitial = INITIAL_ADDRESS_MOCKS.map(normalizeMockAddress);
        saveMockAddresses(normalizedInitial);
        return normalizedInitial;
    }
    const normalized = parsed.map(normalizeMockAddress);
    saveMockAddresses(normalized);
    return normalized;
};

const saveMockAddresses = (addresses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
};

export const addressService = {
    // GET /api/customer/addresses
    getAddresses: async (tenantId, customerId) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            // In mock mode, we might just return all for simplicity or filter by customerId if available
            const filtered = customerId ? all.filter(a => a.customerId === customerId || a.customerId === null) : all;
            return { data: filtered };
        }
        const response = await axiosClient.get('/api/customer/addresses');
        return { data: toAddressList(response) };
    },

    // POST /api/customer/addresses
    createAddress: async (tenantId, customerId, addressData) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            const newAddress = {
                ...addressData,
                id: buildNextMockAddressId(all),
                isMock: true,
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
        const response = await axiosClient.post('/api/customer/addresses', addressData);
        return { data: unwrapData(response) };
    },

    // PUT /api/customer/addresses/{addressId}
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
                isMock: true,
                updatedAt: new Date().toISOString() 
            };
            saveMockAddresses(all);
            return { data: all[idx] };
        }
        const response = await axiosClient.put(`/api/customer/addresses/${addressId}`, addressData);
        return { data: unwrapData(response) };
    },

    // DELETE /api/customer/addresses/{addressId}
    deleteAddress: async (tenantId, customerId, addressId) => {
        if (IS_MOCK) {
            const all = getMockAddresses();
            const filtered = all.filter(a => a.id !== addressId);
            saveMockAddresses(filtered);
            return { data: { success: true } };
        }
        const response = await axiosClient.delete(`/api/customer/addresses/${addressId}`);
        return { data: unwrapData(response) };
    },
};
