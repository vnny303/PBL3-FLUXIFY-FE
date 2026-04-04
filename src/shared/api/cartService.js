import axiosClient from './axiosClient';
import { API_CONFIG, FALLBACK_PRODUCT_IMAGE } from '../lib/constants';
import { normalizeApiList, unwrapApiData } from '../lib/api';

const TENANTS_PREFIX = API_CONFIG.TENANT_PREFIX;

const normalizeCartItem = (item) => ({
  cartItemId: item.id,
  productSkuId: item.productSkuId,
  productId: item.productId,
  name: item.productName,
  image: item.image || FALLBACK_PRODUCT_IMAGE,
  price: Number(item.price ?? item.productPrice ?? 0),
  quantity: Number(item.quantity || 0),
  subTotal: Number(item.subTotal || 0),
  skuAttributes: item.skuAttributes || item.attributes || {},
});

const buildCartSummary = (items) => {
  const normalizedItems = items.map(normalizeCartItem);
  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.subTotal, 0);

  return {
    items: normalizedItems,
    totalAmount,
    count: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
  };
};

export const cartService = {
  async getCart(tenantId, customerId) {
    const response = await axiosClient.get(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/cart`);
    const payload = unwrapApiData(response);

    if (payload && payload.items) {
      return {
        ...payload,
        ...buildCartSummary(payload.items),
      };
    }

    return buildCartSummary(normalizeApiList(response));
  },

  async addItem(tenantId, customerId, body) {
    const response = await axiosClient.post(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/cart/items`, body);
    return unwrapApiData(response);
  },

  async updateItem(tenantId, customerId, itemId, body) {
    const response = await axiosClient.put(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/cart/items/${itemId}`, body);
    return unwrapApiData(response);
  },

  async removeItem(tenantId, customerId, itemId) {
    const response = await axiosClient.delete(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/cart/items/${itemId}`);
    return unwrapApiData(response);
  },

  async clearCart(tenantId, customerId) {
    const response = await axiosClient.delete(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/cart/items`);
    return unwrapApiData(response);
  },
};
