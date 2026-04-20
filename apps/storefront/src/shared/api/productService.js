import axiosClient from './axiosClient';

const safeParseJson = (str, fallback = []) => {
    if (!str) return fallback;
    if (typeof str !== 'string') return str;
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

const normalizeCategory = (category) => ({
    id: category.id,
    name: category.name,
    isActive: category.isActive !== false,
});

const normalizeSku = (sku) => ({
    id: sku.id,
    skuCode: sku.skuCode,
    price: sku.price,
    stock: sku.stock,
    attributes: safeParseJson(sku.attributes, {}),
});

const normalizeProduct = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    basePrice: product.basePrice,
    images: safeParseJson(product.images, []),
    attributes: safeParseJson(product.attributes, {}),
    skus: Array.isArray(product.skus) ? product.skus.map(normalizeSku) : [],
    variants: Array.isArray(product.variants) ? product.variants : [],
});

export const productService = {
    // GET /api/tenants/{tenantId}/products?categoryId=uuid&page=1&pageSize=20
    getProducts: async (tenantId, filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const response = await axiosClient.get(`/api/tenants/${tenantId}/products${query ? `?${query}` : ''}`);
        
        // Handle pagination structure (e.g. { items: [...] } or array)
        if (response && Array.isArray(response.items)) {
            return response.items.map(normalizeProduct);
        }
        if (Array.isArray(response)) {
             return response.map(normalizeProduct);
        }
        return [];
    },

    // GET /api/tenants/{tenantId}/products/{id}
    getProductById: async (tenantId, productId) => {
        const response = await axiosClient.get(`/api/tenants/${tenantId}/products/${productId}`);
        return normalizeProduct(response);
    },

    // GET /api/tenants/{tenantId}/categories
    getCategories: async (tenantId) => {
        const response = await axiosClient.get(`/api/tenants/${tenantId}/categories`);
        if (Array.isArray(response)) {
            return response.map(normalizeCategory);
        }
        return [];
    },
};
