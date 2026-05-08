import { INITIAL_ADDRESS_MOCKS } from '../lib/mocks/addressMock';

const STORAGE_KEY = 'fluxify_customer_addresses';
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

const saveMockAddresses = (addresses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
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
    return parsed;
};

export const addressMockService = {
    getAddresses: async (tenantId, customerId) => {
        const all = getMockAddresses();
        const filtered = customerId ? all.filter(a => a.customerId === customerId || a.customerId === null) : all;
        return { data: filtered };
    },

    createAddress: async (tenantId, customerId, addressData) => {
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
    },

    updateAddress: async (tenantId, customerId, addressId, addressData) => {
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
    },

    deleteAddress: async (tenantId, customerId, addressId) => {
        const all = getMockAddresses();
        const filtered = all.filter(a => a.id !== addressId);
        saveMockAddresses(filtered);
        return { data: { success: true } };
    },
};
