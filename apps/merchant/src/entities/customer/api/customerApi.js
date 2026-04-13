import { USE_MOCK, mockDelay } from '../../../shared/api/config';
import { axiosClient } from '../../../shared/api/axiosClient';
import { MOCK_CUSTOMERS } from './mockData';

// Simulated database state for mutability in mock
let mockCustomersState = [...MOCK_CUSTOMERS];

export const getCustomers = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31' } = {}) => {
    if (USE_MOCK) {
        await mockDelay(500);
        return mockCustomersState.filter(c => c.tenantId === tenantId);
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/customers`);
    }
};

export const getCustomerById = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', customerId }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const customer = mockCustomersState.find(c => c.id === customerId && c.tenantId === tenantId);
        if (!customer) throw new Error('404: Customer không tồn tại hoặc không thuộc tenant này');
        return customer;
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/customers/${customerId}`);
    }
};

export const getCustomerByEmail = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', email }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const customer = mockCustomersState.find(c => c.email === email && c.tenantId === tenantId);
        if (!customer) throw new Error('404: Customer không tồn tại');
        return customer;
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/customers/email/${encodeURIComponent(email)}`);
    }
};

export const getCustomerByCartId = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', cartId }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const customer = mockCustomersState.find(c => c.cart?.id === cartId && c.tenantId === tenantId);
        if (!customer) throw new Error('404: Customer không tồn tại');
        return customer;
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/customers/cart/${cartId}`);
    }
};

export const deleteCustomer = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', customerId }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const index = mockCustomersState.findIndex(c => c.id === customerId && c.tenantId === tenantId);
        if (index === -1) throw new Error('404: Tenant hoặc customer không tồn tại');
        mockCustomersState.splice(index, 1);
        return; // 204 No Content
    } else {
        return await axiosClient.delete(`/tenants/${tenantId}/customers/${customerId}`);
    }
};
