import axiosClient from './axiosClient';

const toNumber = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

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
    price: toNumber(sku.price ?? sku.unitPrice, 0),
    stock: toNumber(sku.stock, 0),
    imgUrl: sku.imgUrl || sku.image,
    attributes: safeParseJson(sku.attributes, {}),
});

const normalizeProduct = (product) => {
    // The backend uses imgUrls, not images
    const rawImages = product.imgUrls || product.images;
    const imagesArray = Array.isArray(rawImages) ? rawImages : safeParseJson(rawImages, []);
    
    // The backend uses productSkus, not skus
    const rawSkus = product.productSkus || product.skus;
    const skus = Array.isArray(rawSkus) ? rawSkus.map(normalizeSku) : [];
    
    let price = toNumber(product.basePrice ?? product.price, 0);
    let stock = 0;
    
    if (skus.length > 0) {
        const validSkuPrices = skus
            .map((sku) => toNumber(sku.price, NaN))
            .filter((skuPrice) => Number.isFinite(skuPrice) && skuPrice >= 0);

        if (validSkuPrices.length > 0) {
            price = Math.min(...validSkuPrices);
        }

        stock = skus.reduce((sum, s) => sum + (s.stock || 0), 0);
    }

    return {
        id: product.id,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        basePrice: product.basePrice,
        images: imagesArray,
        image: imagesArray[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', // generic fallback placeholder
        price: price,
        stock: stock,
        isInStock: stock > 0 || skus.length === 0, // if no skus, assume base item is available unless specified
        attributes: safeParseJson(product.attributes, {}),
        skus: skus,
        variants: Array.isArray(product.variants) ? product.variants : [],
    };
};

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
        if (response && Array.isArray(response.items)) {
            return response.items.map(normalizeCategory);
        }
        if (Array.isArray(response)) {
            return response.map(normalizeCategory);
        }
        return [];
    },
};
