import axiosClient from './axiosClient';
import { createBankTransferInfo } from '../lib/mocks/bankTransferMock';
import { getTenantId, getUserId } from '@fluxify/shared/lib';
import { normalizePaymentMethod } from '../lib/paymentMethod';

const ENABLE_BANK_TRANSFER_MOCK = import.meta.env.VITE_ENABLE_BANK_TRANSFER_MOCK === 'true';

const extractItems = (response) => {
    if (!response) {
        return [];
    }
    if (Array.isArray(response)) {
        return response;
    }
    if (response && Array.isArray(response.items)) {
        return response.items;
    }
    if (response && Array.isArray(response.data)) {
        return response.data;
    }
    if (response?.data && Array.isArray(response.data.items)) {
        return response.data.items;
    }
    if (response?.result && Array.isArray(response.result)) {
        return response.result;
    }
    if (response?.result && Array.isArray(response.result.items)) {
        return response.result.items;
    }
    return [];
};

const normalizeOrder = (order) => {
    if (!order || typeof order !== 'object') return null;

    const orderItems = Array.isArray(order.orderItems)
        ? order.orderItems
        : Array.isArray(order.order_items)
            ? order.order_items
            : Array.isArray(order.items)
                ? order.items
                : [];

    return {
        ...order,
        id: order.id || order.orderId || order.order_id || null,
        status: order.status || order.orderStatus || order.order_status || null,
        paymentMethod: normalizePaymentMethod(order.paymentMethod || order.payment_method || null),
        paymentStatus: order.paymentStatus || order.payment_status || null,
        totalAmount: order.totalAmount ?? order.total_amount ?? order.total ?? 0,
        total: order.total ?? order.totalAmount ?? order.total_amount ?? 0,
        createdAt: order.createdAt || order.created_at || null,
        orderItems,
        items: orderItems,
    };
};

const dedupeOrders = (orders = []) => {
    const map = new Map();
    orders.forEach((order) => {
        const normalized = normalizeOrder(order);
        if (!normalized?.id) return;
        map.set(String(normalized.id), normalized);
    });
    return Array.from(map.values()).sort((a, b) => {
        const left = Date.parse(a?.createdAt || '') || 0;
        const right = Date.parse(b?.createdAt || '') || 0;
        return right - left;
    });
};

export const orderService = {
    getOrders: async (tenantId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await axiosClient.get(`/api/tenants/${tenantId}/orders${query ? `?${query}` : ''}`);
        return extractItems(response);
    },

    getCustomerOrders: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const tenantId = getTenantId();
        const customerId = getUserId();
        let lastError = null;

        // Prefer tenant-level endpoint filtered by current customer to get full data set.
        if (tenantId && customerId) {
            const tenantFilters = new URLSearchParams({
                ...filters,
                customerId,
            }).toString();

            const tenantEndpoints = [
                `/api/tenants/${tenantId}/orders${tenantFilters ? `?${tenantFilters}` : ''}`,
                `/api/tenants/${tenantId}/Orders${tenantFilters ? `?${tenantFilters}` : ''}`,
            ];

            for (const endpoint of tenantEndpoints) {
                try {
                    const response = await axiosClient.get(endpoint);
                    return dedupeOrders(extractItems(response));
                } catch (error) {
                    lastError = error;
                    if (![400, 403, 404].includes(error?.response?.status)) {
                        throw error;
                    }
                }
            }
        }

        // Fallback to customer-scoped endpoint if tenant-level route is unavailable.
        const customerEndpoints = [
            `/api/customer/orders${query ? `?${query}` : ''}`,
            '/api/customer/orders',
        ];

        for (const endpoint of customerEndpoints) {
            try {
                const response = await axiosClient.get(endpoint);
                return dedupeOrders(extractItems(response));
            } catch (error) {
                lastError = error;
                if (![400, 403, 404].includes(error?.response?.status)) {
                    throw error;
                }
            }
        }

        throw lastError || new Error('Unable to fetch customer orders');
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
