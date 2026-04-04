import axiosClient from './axiosClient';
import { API_CONFIG } from '../lib/constants';
import { normalizeApiList, unwrapApiData } from '../lib/api';

const TENANTS_PREFIX = API_CONFIG.TENANT_PREFIX;

export const orderService = {
  async checkout(tenantId, customerId, body) {
    const response = await axiosClient.post(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/checkout`, body);
    return unwrapApiData(response);
  },

  async getCustomerOrders(tenantId, customerId) {
    const response = await axiosClient.get(`${TENANTS_PREFIX}/${tenantId}/customers/${customerId}/orders`);
    return normalizeApiList(response);
  },

  async getOrderDetail(tenantId, orderId) {
    const response = await axiosClient.get(`${TENANTS_PREFIX}/${tenantId}/orders/${orderId}`);
    return unwrapApiData(response);
  },
};
