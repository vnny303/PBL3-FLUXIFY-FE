import { USE_MOCK, mockDelay } from '../../../shared/api/config';
import { axiosClient } from '../../../shared/api/axiosClient';
import { getTenantId } from '@fluxify/shared/lib';
import { MOCK_ORDERS } from './mockData';

const resolveTenantId = (tenantId) => {
    const resolvedTenantId = tenantId || getTenantId();
    if (!resolvedTenantId) {
        throw new Error('Thiếu tenantId. Hãy đăng nhập merchant và chọn tenant hợp lệ.');
    }
    return resolvedTenantId;
};

/**
 * Fetch orders for a given tenant with pagination and filtering
 */
export const getOrders = async ({ tenantId, page = 1, limit = 20, status, customerId } = {}) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);

        let filteredOrders = MOCK_ORDERS.filter((o) => o.tenantId === resolvedTenantId);
        if (status && status !== 'All') {
            filteredOrders = filteredOrders.filter(o => o.status === status);
        }
        if (customerId) {
            filteredOrders = filteredOrders.filter(o => o.customerId === customerId);
        }

        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedOrders = filteredOrders.slice(start, end);

        return {
            data: paginatedOrders,
            total: filteredOrders.length
        };
    } else {
        // Real Backend Fetch
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        if (status && status !== 'All') {
            queryParams.append('status', status);
        }
        if (customerId) {
            queryParams.append('customerId', customerId);
        }

        const data = await axiosClient.get(`/api/tenants/${resolvedTenantId}/orders?${queryParams.toString()}`);

        // Assume backend returns { data: [], total: number } or similar
        // If the backend returns just an array directly [ { order... } ], we adapt here:
        return {
            data: Array.isArray(data) ? data : data.items || data.data || [],
            total: data.total || (Array.isArray(data) ? data.length : 0)
        };
    }
};

export const getOrderById = async ({ tenantId, id }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(600);
        const order = MOCK_ORDERS.find(o => o.id === id && o.tenantId === resolvedTenantId);
        if (!order) throw new Error('404: Order not found');
        return order;
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/orders/${id}`);
    }
};

export const updateOrderStatus = async ({ tenantId, id, status }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const order = MOCK_ORDERS.find(o => o.id === id && o.tenantId === resolvedTenantId);
        if (!order) throw new Error('404: Order not found');
        order.status = status;
        return order;
    } else {
        // According to REST, maybe PUT or PATCH to /orders/{id}/status
        return await axiosClient.put(`/api/tenants/${resolvedTenantId}/orders/${id}/status`, { status });
    }
};

export const createOrder = async ({ tenantId, data }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(1000);
        const newOrderId = "91111111-1111-4111-8111-" + Math.random().toString(36).substr(2, 9);
        const totalAmount = data.orderItems?.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0) || 0;
        const newOrder = {
            id: newOrderId,
            tenantId: resolvedTenantId,
            status: "Pending",
            paymentStatus: "Pending",
            createdAt: new Date().toISOString(),
            totalAmount,
            ...data
        };
        MOCK_ORDERS.unshift(newOrder);
        return newOrder;
    } else {
        return await axiosClient.post(`/api/tenants/${resolvedTenantId}/orders`, data);
    }
};
