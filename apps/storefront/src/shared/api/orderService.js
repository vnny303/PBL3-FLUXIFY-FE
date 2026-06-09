import axiosClient from './axiosClient';
import { getTenantId, getUserId } from '@fluxify/shared/lib';
import { normalizePaymentMethod } from '../lib/paymentMethod';

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

const safeParseJson = (value, fallback = {}) => {
    if (!value) return fallback;
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
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
    const normalizedOrderItems = orderItems.map(item => ({
        ...item,
        image: item.imageUrl || item.image || item.imgUrl || item.thumbnail || item.productImage || item.productImgUrl || null,
        productName: item.productName || item.name || item.product_name,
        productId: item.productId || item.ProductId || item.product_id,
        productSkuId: item.productSkuId || item.ProductSkuId || item.product_sku_id,
        skuAttributes: item.skuAttributes || item.attributes || safeParseJson(item.selectedOptions || item.SelectedOptions || item.selected_options, {}),
    }));

    return {
        ...order,
        id: order.id || order.orderId || order.order_id || null,
        orderCode: order.orderCode || order.order_code || null,
        addressId: order.addressId || order.AddressId || order.address_id || null,
        status: order.status || order.orderStatus || order.order_status || null,
        paymentMethod: normalizePaymentMethod(order.paymentMethod || order.payment_method || null),
        paymentStatus: order.paymentStatus || order.payment_status || null,
        paymentReference: order.paymentReference || order.payment_reference || null,
        bankName: order.bankName || order.bank_name || null,
        bankCode: order.bankCode || order.bank_code || null,
        bankAccountNumber: order.bankAccountNumber || order.bank_account_number || null,
        bankAccountName: order.bankAccountName || order.bank_account_name || null,
        transferContent: order.transferContent || order.transfer_content || null,
        totalAmount: order.totalAmount ?? order.total_amount ?? order.total ?? 0,
        total: order.total ?? order.totalAmount ?? order.total_amount ?? 0,
        subtotal: order.subtotal ?? order.subTotal ?? order.sub_total ?? 0,
        shippingFee: order.shippingFee ?? order.shipping_fee ?? 0,
        shippingMethod: order.shippingMethod || order.shipping_method || null,
        shippingAddress: order.shippingAddress || order.shipping_address || order.address || null,
        orderNote: order.orderNote || order.order_note || null,
        createdAt: order.createdAt || order.created_at || null,
        orderItems: normalizedOrderItems,
        items: normalizedOrderItems,
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

    checkout: async ({
        addressId,
        paymentMethod,
        orderNote,
        shippingMethod,
    }) => {
        if (!addressId) {
            throw new Error("Missing addressId. Please select a saved address before checkout.");
        }

        const normalizedShippingMethod = String(shippingMethod || 'standard').toLowerCase();
        if (normalizedShippingMethod !== 'standard' && normalizedShippingMethod !== 'express') {
            throw new Error("Invalid shipping method. Must be standard or express.");
        }

        // ─── LIVE CHECKOUT MODE ───────────────────────────────────────────────────
        const body = {
            addressId,
            paymentMethod,
            orderNote: orderNote || null,
            shippingMethod: normalizedShippingMethod
        };

        let data;
        try {
            data = await axiosClient.post('/api/customer/orders/checkout', body);
        } catch (error) {
            console.error('Checkout API Error:', {
                status: error?.response?.status,
                data: error?.response?.data,
                payload: body
            });
            throw error;
        }

        return data;
    },

    getCustomerOrderDetail: async (orderId) => {
        if (!orderId) return null;

        const endpoints = [
            `/api/customer/orders/${orderId}`,
            `/api/customer/Orders/${orderId}`,
        ];
        let lastError = null;

        for (const endpoint of endpoints) {
            try {
                const response = await axiosClient.get(endpoint);
                return normalizeOrder(response);
            } catch (error) {
                lastError = error;
                if (![400, 403, 404].includes(error?.response?.status)) {
                    throw error;
                }
            }
        }

        try {
            const orders = await orderService.getCustomerOrders({ page: 1, pageSize: 100 });
            return orders.find((order) => String(order?.id) === String(orderId)) || null;
        } catch (error) {
            if (lastError) return null;
            throw error;
        }
    },

    updateOrderStatus: async (tenantId, orderId, { status }) => {
        return await axiosClient.put(`/api/tenants/${tenantId}/orders/${orderId}/status`, {
            status,
        });
    },
    cancelOrder: async (orderId, reason = '') => {
        return await axiosClient.put(`/api/customer/orders/${orderId}/cancel`, { reason });
    },
};
