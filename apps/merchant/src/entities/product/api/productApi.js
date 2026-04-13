import { USE_MOCK, mockDelay } from '../../../shared/api/config';
import { axiosClient } from '../../../shared/api/axiosClient';
import { MOCK_PRODUCTS } from './mockData';

let mockProductsState = [...MOCK_PRODUCTS];

// PRODUCT ENDPOINTS
export const getProducts = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31' } = {}) => {
    if (USE_MOCK) {
        await mockDelay(500);
        return mockProductsState.filter(p => p.tenantId === tenantId);
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/products`);
    }
};

export const getProductById = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === tenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        return p;
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/products/${id}`);
    }
};

export const createProduct = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', data }) => {
    if (USE_MOCK) {
        await mockDelay(800);
        const newProduct = {
            id: crypto.randomUUID(),
            tenantId,
            ...data,
            productSkus: (data.skus || []).map(s => ({ id: crypto.randomUUID(), ...s }))
        };
        mockProductsState.push(newProduct);
        return newProduct;
    } else {
        return await axiosClient.post(`/tenants/${tenantId}/products`, data);
    }
};

export const updateProduct = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id, data }) => {
    if (USE_MOCK) {
        await mockDelay(600);
        const idx = mockProductsState.findIndex(x => x.id === id && x.tenantId === tenantId);
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
        return await axiosClient.put(`/tenants/${tenantId}/products/${id}`, data);
    }
};

export const deleteProduct = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const idx = mockProductsState.findIndex(x => x.id === id && x.tenantId === tenantId);
        if (idx === -1) throw new Error('404: Product không tồn tại');
        mockProductsState.splice(idx, 1);
        return { message: "Xóa thành công!" };
    } else {
        return await axiosClient.delete(`/tenants/${tenantId}/products/${id}`);
    }
};

// SKU ENDPOINTS
export const getSkus = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id }) => {
    if (USE_MOCK) {
        await mockDelay(300);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === tenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        return p.productSkus || [];
    } else {
        return await axiosClient.get(`/tenants/${tenantId}/products/${id}/skus`);
    }
};

export const createSku = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id, data }) => {
    if (USE_MOCK) {
        await mockDelay(600);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === tenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        const newSku = { id: crypto.randomUUID(), productId: id, ...data };
        p.productSkus.push(newSku);
        return newSku;
    } else {
        return await axiosClient.post(`/tenants/${tenantId}/products/${id}/skus`, data);
    }
};

export const updateSku = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id, skuId, data }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === tenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        const skuIdx = p.productSkus.findIndex(s => s.id === skuId);
        if (skuIdx === -1) throw new Error('404: SKU không tồn tại');
        
        p.productSkus[skuIdx] = { ...p.productSkus[skuIdx], ...data };
        return p.productSkus[skuIdx];
    } else {
        return await axiosClient.put(`/tenants/${tenantId}/products/${id}/skus/${skuId}`, data);
    }
};

export const deleteSku = async ({ tenantId = '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', id, skuId }) => {
    if (USE_MOCK) {
        await mockDelay(500);
        const p = mockProductsState.find(x => x.id === id && x.tenantId === tenantId);
        if (!p) throw new Error('404: Product không tồn tại');
        const skuIdx = p.productSkus.findIndex(s => s.id === skuId);
        if (skuIdx === -1) throw new Error('404: SKU không tồn tại');
        p.productSkus.splice(skuIdx, 1);
        return { message: "Xóa SKU thành công!" };
    } else {
        return await axiosClient.delete(`/tenants/${tenantId}/products/${id}/skus/${skuId}`);
    }
};
