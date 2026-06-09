import axiosClient from './axiosClient';
import { getTenantId, getUserId } from '@fluxify/shared/lib';
import { normalizePaymentMethod } from '../lib/paymentMethod';

const LAST_CHECKOUT_ORDER_KEY = 'fluxify_last_checkout_order';
const DEMO_ORDERS_KEY_PREFIX = 'fluxify_demo_orders_';
const TEMP_PENDING_CANCEL_ORDER_ID = 'mock-pending-cancel-order';
const TEMP_PENDING_CANCEL_ORDER_KEY_PREFIX = 'fluxify_temp_pending_cancel_order_';
const USE_TEMP_PENDING_CANCEL_ORDER = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
        orderItems: orderItems.map(item => ({
            ...item,
            image: item.imageUrl || item.image || item.imgUrl || item.thumbnail || item.productImage || item.productImgUrl || null,
            productName: item.productName || item.name || item.product_name,
            productSkuId: item.productSkuId || item.ProductSkuId || item.product_sku_id,
        })),
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

const buildTempPendingCancelOrder = (customerId, tenantId) => ({
    id: TEMP_PENDING_CANCEL_ORDER_ID,
    tenantId: tenantId || 'tenant-studyhub-demo',
    customerId,
    addressId: 'addr-001',
    orderCode: 'MOCK-CANCEL-001',
    paymentReference: 'MOCK-CANCEL-001',
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    bankName: null,
    bankCode: null,
    bankAccountNumber: null,
    bankAccountName: null,
    transferContent: null,
    status: 'Pending',
    subtotal: 218000,
    shippingFee: 25000,
    taxAmount: 0,
    totalAmount: 243000,
    total: 243000,
    paidAt: null,
    shippingMethod: 'standard',
    orderNote: 'Temporary storefront mock order for cancel testing.',
    createdAt: new Date(Date.now() + 60000).toISOString(),
    persisted: false,
    orderItems: [
        {
            id: 'mock-pending-cancel-item-1',
            orderId: TEMP_PENDING_CANCEL_ORDER_ID,
            productSkuId: 'p-001-sku-1-1',
            productName: 'Campus A5 Grid Notebook Set',
            image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=300&q=80',
            quantity: 1,
            unitPrice: 89000,
            skuAttributes: { color: 'Sage', size: 'A5' },
        },
        {
            id: 'mock-pending-cancel-item-2',
            orderId: TEMP_PENDING_CANCEL_ORDER_ID,
            productSkuId: 'p-003-sku-1-1',
            productName: 'Premium Gel Pen Pack',
            image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=300&q=80',
            quantity: 1,
            unitPrice: 129000,
            skuAttributes: { color: 'Black', size: '0.5mm' },
        },
    ],
});

const getTempPendingCancelOrder = (customerId, tenantId) => {
    if (!USE_TEMP_PENDING_CANCEL_ORDER || !customerId) return null;

    const storageKey = `${TEMP_PENDING_CANCEL_ORDER_KEY_PREFIX}${customerId}`;
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (stored?.id === TEMP_PENDING_CANCEL_ORDER_ID) {
            return normalizeOrder(stored);
        }
    } catch {
        // Ignore invalid temporary mock storage.
    }

    return normalizeOrder(buildTempPendingCancelOrder(customerId, tenantId));
};

const setTempPendingCancelOrderStatus = (orderId, status) => {
    if (!USE_TEMP_PENDING_CANCEL_ORDER || orderId !== TEMP_PENDING_CANCEL_ORDER_ID) {
        return false;
    }

    const customerId = getUserId();
    if (!customerId) return false;

    const storageKey = `${TEMP_PENDING_CANCEL_ORDER_KEY_PREFIX}${customerId}`;
    const existing = getTempPendingCancelOrder(customerId, getTenantId());
    const nextOrder = {
        ...existing,
        status,
        paymentStatus: status === 'Cancelled' ? 'Failed' : existing?.paymentStatus || 'Pending',
    };

    try {
        localStorage.setItem(storageKey, JSON.stringify(nextOrder));
    } catch {
        // Ignore storage write failures.
    }

    return true;
};

const persistDemoOrder = (order, customerId) => {
    if (!order || typeof order !== 'object') return;

    try {
        sessionStorage.setItem(LAST_CHECKOUT_ORDER_KEY, JSON.stringify(order));
    } catch {
        // Ignore storage write failures.
    }

    if (!customerId) return;

    try {
        const storageKey = `${DEMO_ORDERS_KEY_PREFIX}${customerId}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const safeExisting = Array.isArray(existing) ? existing : [];
        const merged = [order, ...safeExisting]
            .filter((item, index, array) => {
                const id = String(item?.id || '');
                if (!id) return false;
                return array.findIndex((candidate) => String(candidate?.id || '') === id) === index;
            })
            .slice(0, 20);
        localStorage.setItem(storageKey, JSON.stringify(merged));
    } catch {
        // Ignore storage write failures.
    }
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
                    return dedupeOrders([
                        getTempPendingCancelOrder(customerId, tenantId),
                        ...extractItems(response),
                    ].filter(Boolean));
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
                return dedupeOrders([
                    getTempPendingCancelOrder(customerId, tenantId),
                    ...extractItems(response),
                ].filter(Boolean));
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
        cartItems = [],
        cartTotal = 0,
        shippingFee = 0,
        user = null,
        finalAddress = null,
        selectedAddress = null,
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
        if (setTempPendingCancelOrderStatus(orderId, 'Cancelled')) {
            return { ok: true, id: orderId, reason };
        }

        return await axiosClient.put(`/api/customer/orders/${orderId}/cancel`, { reason });
    },
};
