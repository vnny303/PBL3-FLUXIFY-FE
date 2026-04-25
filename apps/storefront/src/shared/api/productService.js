import axiosClient from './axiosClient';
import { mockProducts, mockCategories } from '../lib/mocks/productMock';

const isMockEnabled = import.meta.env.VITE_ENABLE_PRODUCTS_MOCK === 'true';

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

const normalizeSpecificationEntries = (raw) => {
    if (!raw) return [];

    const parsed = safeParseJson(raw, raw);
    if (Array.isArray(parsed)) {
        return parsed
            .map((item) => ({
                name: item?.name || item?.Name || item?.label || item?.Label || item?.key || item?.Key || '',
                value: item?.value ?? item?.Value,
            }))
            .filter((item) => item.name && item.value !== undefined && item.value !== null)
            .map((item) => ({
                name: String(item.name),
                value: Array.isArray(item.value) ? item.value.join(',') : String(item.value),
            }));
    }

    if (parsed && typeof parsed === 'object') {
        return Object.entries(parsed).map(([key, value]) => ({
            name: String(key),
            value: Array.isArray(value) ? value.join(',') : String(value),
        }));
    }

    return [];
};

const normalizeDetailSections = (raw) => {
    if (!raw) return [];

    const parsed = safeParseJson(raw, raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
        .map((section) => ({
            title: section?.title || section?.Title || section?.name || section?.Name || section?.heading || section?.Heading || '',
            content: section?.content || section?.Content || section?.description || section?.Description || section?.body || section?.Body || '',
        }))
        .filter((section) => section.title && section.content);
};

const normalizeCategory = (category) => ({
    id: category.id,
    name: category.name,
    isActive: category.isActive !== false,
});

const normalizeSku = (sku) => {
    if (!sku) return null;
    const skuId = sku.id || sku.productSkuId || sku.skuId || null;
    return {
        id: skuId,
        productSkuId: skuId,
        skuCode: sku.skuCode,
        price: toNumber(sku.price ?? sku.unitPrice, 0),
        stock: toNumber(sku.stock, 0),
        imgUrl: sku.imgUrl || sku.image,
        attributes: safeParseJson(sku.attributes, {}),
    };
};

const normalizeProduct = (product) => {
    if (!product) return null;
    const rawImages = product.imgUrls || product.images;
    const imagesArray = Array.isArray(rawImages) ? rawImages : safeParseJson(rawImages, []);
    
    const rawSkus = product.productSkus || product.skus;
    const skus = Array.isArray(rawSkus) ? rawSkus.map(normalizeSku).filter(Boolean) : [];
    
    // Extract everything needed at the top level
    const allSizes = new Set();
    const allColors = new Set();
    let minPrice = toNumber(product.basePrice ?? product.price, 0);
    let stock = 0;
    
    if (skus.length > 0) {
        const validSkuPrices = skus.map(s => s.price).filter(p => p > 0);
        if (validSkuPrices.length > 0) minPrice = Math.min(...validSkuPrices);
        stock = skus.reduce((sum, s) => sum + (s.stock || 0), 0);
        
        skus.forEach(s => {
            if (s.attributes) {
                if (s.attributes.size) allSizes.add(s.attributes.size);
                if (s.attributes.color) allColors.add(s.attributes.color);
            }
        });
    }

    const normalizedAttributes = safeParseJson(product.attributes, {});
    const normalizedSpecifications = normalizeSpecificationEntries(
        product.specifications ||
        product.Specifications ||
        product.specs ||
        product.Specs ||
        product.specification ||
        product.Specification ||
        product.productSpecifications ||
        product.product_specifications
    );

    return {
        id: product.id,
        name: product.name,
        description: product.description || product.desc || 'No description available',
        overview: product.overview || product.description || product.desc || '',
        categoryId: product.categoryId,
        basePrice: product.basePrice,
        images: imagesArray,
        image: imagesArray[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        price: minPrice,
        stock: stock,
        isInStock: stock > 0,
        skus: skus,
        productSkus: skus,
        isNew: !!product.isNew,
        isSale: !!product.isSale,
        isBestSeller: !!product.isBestSeller,
        discountLabel: product.discountLabel,
        rating: toNumber(product.rating || product.averageRating, 0),
        reviewCount: toNumber(product.reviewCount || product.numReviews, 0),
        soldCount: toNumber(product.soldCount, 0),
        attributes: normalizedAttributes,
        detailSections: normalizeDetailSections(
            product.detailSections ||
            product.DetailSections ||
            product.detailsSections ||
            product.DetailsSections ||
            product.detail_sections ||
            product.moreInfoSections
        ),
        specifications: normalizedSpecifications.length > 0
            ? normalizedSpecifications
            : normalizeSpecificationEntries(normalizedAttributes),
    };
};

export const productService = {
    // GET /api/tenants/{tenantId}/products?categoryId=uuid&page=1&pageSize=20
    getProducts: async (tenantId, filters = {}) => {
        let products = [];

        if (isMockEnabled) {
            let filtered = [...mockProducts];
            if (filters.categoryId) {
                filtered = filtered.filter(p => p.categoryId === filters.categoryId);
            }
            products = filtered.map(normalizeProduct);
        } else {
            const query = new URLSearchParams(filters).toString();
            const response = await axiosClient.get(`/api/tenants/${tenantId}/products${query ? `?${query}` : ''}`);
            
            if (response && Array.isArray(response.items)) {
                products = response.items.map(normalizeProduct);
            } else if (Array.isArray(response)) {
                products = response.map(normalizeProduct);
            }
        }

        // Sort: In-stock items first, Out-of-stock last
        return products.sort((a, b) => {
            if (a.isInStock === b.isInStock) return 0;
            return a.isInStock ? -1 : 1;
        });
    },

    // GET /api/tenants/{tenantId}/products/{id}
    getProductById: async (tenantId, productId) => {
        if (isMockEnabled) {
            const found = mockProducts.find(p => p.id === productId);
            return found ? normalizeProduct(found) : null;
        }

        const response = await axiosClient.get(`/api/tenants/${tenantId}/products/${productId}`);
        return normalizeProduct(response);
    },

    // GET /api/tenants/{tenantId}/categories
    getCategories: async (tenantId) => {
        if (isMockEnabled) {
            return mockCategories.map(normalizeCategory);
        }

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
