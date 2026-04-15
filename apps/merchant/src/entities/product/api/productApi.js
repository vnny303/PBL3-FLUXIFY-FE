import { USE_MOCK, mockDelay } from '../../../shared/api/config';
import { axiosClient } from '../../../shared/api/axiosClient';
import { getTenantId } from '@fluxify/shared/lib';
import { MOCK_PRODUCTS } from './mockData';

let mockProductsState = [...MOCK_PRODUCTS];

const resolveTenantId = (tenantId) => {
    const resolvedTenantId = tenantId || getTenantId();
    if (!resolvedTenantId) {
        throw new Error('Thiếu tenantId. Hãy đăng nhập merchant và chọn tenant hợp lệ.');
    }
    return resolvedTenantId;
};

// PRODUCT ENDPOINTS
export const getProducts = async ({ tenantId } = {}) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        return mockProductsState.filter(p => p.tenantId === resolvedTenantId);
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/products`);
    }
};

export const getProductById = async ({ tenantId, id }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === resolvedTenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        return p;
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/products/${id}`);
    }
};

export const createProduct = async ({ tenantId, data }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(800);
        const newProduct = {
            id: crypto.randomUUID(),
            tenantId: resolvedTenantId,
            ...data,
            productSkus: (data.skus || []).map(s => ({ id: crypto.randomUUID(), ...s }))
        };
        mockProductsState.push(newProduct);
        return newProduct;
    } else {
        return await axiosClient.post(`/api/tenants/${resolvedTenantId}/products`, data);
    }
};

export const updateProduct = async ({ tenantId, id, data }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(600);
        const idx = mockProductsState.findIndex(x => x.id === id && x.tenantId === resolvedTenantId);
        if (idx === -1) throw new Error('404: Product không tồn tại');
        
        const existingProduct = mockProductsState[idx];
        const updatedProduct = {
            ...existingProduct,
            ...data,
            imgUrls: data.imgUrls ? data.imgUrls : existingProduct.imgUrls
        };
        mockProductsState[idx] = updatedProduct;
        return updatedProduct;
    } else {
        return await axiosClient.put(`/api/tenants/${resolvedTenantId}/products/${id}`, data);
    }
};

export const deleteProduct = async ({ tenantId, id }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const idx = mockProductsState.findIndex(x => x.id === id && x.tenantId === resolvedTenantId);
        if (idx === -1) throw new Error('404: Product không tồn tại');
        mockProductsState.splice(idx, 1);
        return { message: "Xóa thành công!" };
    } else {
        return await axiosClient.delete(`/api/tenants/${resolvedTenantId}/products/${id}`);
    }
};

// SKU ENDPOINTS
export const getSkus = async ({ tenantId, id }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(300);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === resolvedTenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        return p.productSkus || [];
    } else {
        return await axiosClient.get(`/api/tenants/${resolvedTenantId}/products/${id}/skus`);
    }
};

export const createSku = async ({ tenantId, id, data }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(600);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === resolvedTenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        const newSku = { id: crypto.randomUUID(), productId: id, ...data };
        p.productSkus.push(newSku);
        return newSku;
    } else {
        return await axiosClient.post(`/api/tenants/${resolvedTenantId}/products/${id}/skus`, data);
    }
};

export const updateSku = async ({ tenantId, id, skuId, data }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === resolvedTenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        const skuIdx = p.productSkus.findIndex(s => s.id === skuId);
        if (skuIdx === -1) throw new Error('404: SKU không tồn tại');
        
        p.productSkus[skuIdx] = { ...p.productSkus[skuIdx], ...data };
        return p.productSkus[skuIdx];
    } else {
        return await axiosClient.put(`/api/tenants/${resolvedTenantId}/products/${id}/skus/${skuId}`, data);
    }
};

export const deleteSku = async ({ tenantId, id, skuId }) => {
    const resolvedTenantId = resolveTenantId(tenantId);
    if (USE_MOCK) {
        await mockDelay(500);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === resolvedTenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        const skuIdx = p.productSkus.findIndex(s => s.id === skuId);
        if (skuIdx === -1) throw new Error('404: SKU không tồn tại');
        p.productSkus.splice(skuIdx, 1);
        return { message: "Xóa SKU thành công!" };
    } else {
        return await axiosClient.delete(`/api/tenants/${resolvedTenantId}/products/${id}/skus/${skuId}`);
    }
};
