import { USE_MOCK, mockDelay } from '../../../shared/api/config';
import { axiosClient } from '../../../shared/api/axiosClient';
import { getTenantId } from '@fluxify/shared/lib';
import { MOCK_CUSTOMERS } from './mockData';

// Simulated database state for mutability in mock
let mockCustomersState = [...MOCK_CUSTOMERS];

const resolveTenantId = (tenantId) => {
    const resolvedTenantId = tenantId || getTenantId();
    if (!resolvedTenantId) {
        throw new Error('Thiếu tenantId. Hãy đăng nhập merchant và chọn tenant hợp lệ.');
    }
    return resolvedTenantId;
};

export const getCustomers = async ({ tenantId } = {}) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        return mockCustomersState.filter(c => c.tenantId === resolvedTenantId);
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/customers`);
    }
};

export const getCustomerById = async ({ tenantId, customerId }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const customer = mockCustomersState.find(c => c.id === customerId && c.tenantId === resolvedTenantId);
        if (!customer) throw new Error('404: Customer không tồn tại hoặc không thuộc tenant này');
        return customer;
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/customers/${customerId}`);
    }
};

export const getCustomerByEmail = async ({ tenantId, email }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const customer = mockCustomersState.find(c => c.email === email && c.tenantId === resolvedTenantId);
        if (!customer) throw new Error('404: Customer không tồn tại');
        return customer;
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/customers/email/${encodeURIComponent(email)}`);
    }
};

export const getCustomerByCartId = async ({ tenantId, cartId }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const customer = mockCustomersState.find(c => c.cart?.id === cartId && c.tenantId === resolvedTenantId);
        if (!customer) throw new Error('404: Customer không tồn tại');
        return customer;
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/customers/cart/${cartId}`);
    }
};

export const deleteCustomer = async ({ tenantId, customerId }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const index = mockCustomersState.findIndex(c => c.id === customerId && c.tenantId === resolvedTenantId);
        if (index === -1) throw new Error('404: Tenant hoặc customer không tồn tại');
        mockCustomersState.splice(index, 1);
        return; // 204 No Content
    } else {
        return await axiosClient.delete(`/api/tenants/${resolvedTenantId}/customers/${customerId}`);
    }
};
