import axiosClient from './axiosClient';
import { API_CONFIG, FALLBACK_PRODUCT_IMAGE } from '../lib/constants';
import { normalizeApiList, unwrapApiData } from '../lib/api';

const TENANTS_PREFIX = API_CONFIG.TENANT_PREFIX;

const buildQueryString = ({ categoryId, subdomain } = {}) => {
  const params = new URLSearchParams();
  if (categoryId) params.set('categoryId', categoryId);
  if (subdomain) params.set('subdomain', subdomain);

  const query = params.toString();
  return query ? `?${query}` : '';
};

const parseJsonObject = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeSku = (sku) => {
  const attributes = parseJsonObject(sku.attributes) || {};
  return {
    id: sku.id,
    productId: sku.productId,
    price: Number(sku.price || 0),
    stock: Number(sku.stock || 0),
    attributes,
  };
};

export const normalizeProduct = (product) => {
  const skus = Array.isArray(product.productSkus) ? product.productSkus.map(normalizeSku) : [];
  const lowestSku = skus.reduce((best, sku) => (best === null || sku.price < best.price ? sku : best), null);
  const attributes = parseJsonObject(product.attributes) || {};

  return {
    id: product.id,
    tenantId: product.tenantId,
    categoryId: product.categoryId,
    name: product.name,
    desc: product.description || '',
    image: product.image || FALLBACK_PRODUCT_IMAGE,
    img: product.image || FALLBACK_PRODUCT_IMAGE,
    attributes,
    skus,
    price: lowestSku?.price ?? 0,
    stock: skus.reduce((sum, sku) => sum + sku.stock, 0),
    cat: product.categoryName,
  };
};

export const productService = {
  async getProducts(tenantId, options = {}) {
    const suffix = buildQueryString({
      categoryId: options.categoryId,
      subdomain: options.subdomain,
    });
    const response = await axiosClient.get(`${TENANTS_PREFIX}/${tenantId}/products${suffix}`);
    return normalizeApiList(response).map(normalizeProduct);
  },

  async getProductById(tenantId, productId, options = {}) {
    const suffix = buildQueryString({ subdomain: options.subdomain });
    const response = await axiosClient.get(`${TENANTS_PREFIX}/${tenantId}/products/${productId}${suffix}`);
    return normalizeProduct(unwrapApiData(response));
  },

  async getCategories(tenantId, options = {}) {
    const suffix = buildQueryString({ subdomain: options.subdomain });
    const response = await axiosClient.get(`${TENANTS_PREFIX}/${tenantId}/categories${suffix}`);
    return normalizeApiList(response).map((category) => ({
      id: category.id,
      tenantId: category.tenantId,
      name: category.name,
      description: category.description || '',
      isActive: category.isActive ?? true,
    }));
  },
};
