import axiosClient from './axiosClient';
import { createBankTransferInfo } from '../lib/bankTransferMock';

const ENABLE_BANK_TRANSFER_MOCK = import.meta.env.VITE_ENABLE_BANK_TRANSFER_MOCK === 'true';

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
    getOrders: async (tenantId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await axiosClient.get(`/api/tenants/${tenantId}/orders${query ? `?${query}` : ''}`);
        return extractItems(response);
    },

    getCustomerOrders: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await axiosClient.get(`/api/customer/orders${query ? `?${query}` : ''}`);
        return extractItems(response);
    },

    checkout: async ({ address, paymentMethod }) => {
        const body = { address, paymentMethod };
        let data = await axiosClient.post('/api/customer/orders/checkout', body);

        // Mock Bank Transfer details if enabled and applicable
        if (ENABLE_BANK_TRANSFER_MOCK && paymentMethod === 'BankTransfer') {
            // Check for potential amount field variants
            const finalAmount = data?.totalAmount ?? data?.total_amount ?? data?.total ?? 0;
            
            data = {
                ...data,
                bankTransferInfo: createBankTransferInfo({
                    orderCode: data?.id,
                    totalAmount: finalAmount,
                })
            };
        }

        return data;
    },

    updateOrderStatus: async (tenantId, orderId, { status }) => {
        return await axiosClient.put(`/api/tenants/${tenantId}/orders/${orderId}/status`, {
            status,
        });
    },
};
