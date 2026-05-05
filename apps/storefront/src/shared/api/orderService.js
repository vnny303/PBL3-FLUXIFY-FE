import axiosClient from './axiosClient';
import { createBankTransferInfo } from '../lib/mocks/bankTransferMock';
import { getTenantId, getUserId } from '@fluxify/shared/lib';
import { normalizePaymentMethod } from '../lib/paymentMethod';

const ENABLE_BANK_TRANSFER_MOCK = import.meta.env.VITE_ENABLE_BANK_TRANSFER_MOCK === 'true';
const CHECKOUT_MODE = import.meta.env.VITE_CHECKOUT_MODE || 'live';
const LAST_CHECKOUT_ORDER_KEY = 'fluxify_last_checkout_order';
const DEMO_ORDERS_KEY_PREFIX = 'fluxify_demo_orders_';

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

        // ─── MOCK CHECKOUT MODE ───────────────────────────────────────────────────
        // When VITE_CHECKOUT_MODE=mock, build a local demo order and skip the API call entirely.
        if (CHECKOUT_MODE === 'mock') {
            const demoOrderItems = cartItems.map((item) => ({
                id: item.cartItemId || item.id || `demo-item-${Math.random().toString(36).slice(2)}`,
                productSkuId: item.productSkuId || null,
                productName: item.productName || item.name || 'Product',
                quantity: item.quantity || 1,
                unitPrice: item.price ?? item.unitPrice ?? 0,
                image: item.image || item.imgUrl || null,
                skuAttributes: item.skuAttributes || null,
            }));

            const demoSubtotal = cartTotal || demoOrderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
            const demoTotal = demoSubtotal + shippingFee;
            const demoOrderCode = `DEMO-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

            const demoOrder = {
                id: `demo-${Date.now()}`,
                orderCode: demoOrderCode,
                customerId: user?.userId || null,
                tenantId: user?.tenantId || null,
                status: 'Pending',
                paymentStatus: 'Pending',
                paymentMethod,
                orderNote: orderNote || null,
                shippingMethod: normalizedShippingMethod,
                shippingFee,
                subtotal: demoSubtotal,
                totalAmount: demoTotal,
                addressSnapshot: finalAddress,
                shippingAddress: finalAddress,
                createdAt: new Date().toISOString(),
                orderItems: demoOrderItems,
                persisted: false,
                source: 'demo-checkout',
                // Bank Transfer mock if applicable
                ...(paymentMethod === 'BankTransfer' ? {
                    bankTransferInfo: createBankTransferInfo({
                        orderCode: demoOrderCode,
                        totalAmount: demoTotal,
                    })
                } : {}),
            };

            persistDemoOrder(demoOrder, user?.userId || demoOrder.customerId);

            return demoOrder;
        }

        // ─── LIVE CHECKOUT MODE ───────────────────────────────────────────────────
        if (selectedAddress?.isMock) {
            throw new Error('Please select a real saved address before live checkout.');
        }

        // MOCK BYPASS: The backend strictly blocks "BankTransfer" if the tenant hasn't configured bank details.
        // If enabled, send COD to backend and restore BankTransfer in FE response.
        const actualPaymentMethod = (ENABLE_BANK_TRANSFER_MOCK && paymentMethod === 'BankTransfer')
            ? 'COD'
            : paymentMethod;

        const body = {
            addressId,
            paymentMethod: actualPaymentMethod,
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

        if (ENABLE_BANK_TRANSFER_MOCK && paymentMethod === 'BankTransfer') {
            data = {
                ...data,
                paymentMethod: 'BankTransfer',
                bankTransferInfo: createBankTransferInfo({
                    orderCode: data?.id || data?.orderCode,
                    totalAmount: data?.totalAmount ?? data?.total_amount ?? data?.total ?? 0,
                })
            };
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
    cancelOrder: async (orderId) => {
        return await axiosClient.post(`/api/customer/orders/${orderId}/cancel`);
    },
};
