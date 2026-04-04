import axiosClient from './axiosClient';
import { API_CONFIG } from '../lib/constants';
import { unwrapApiData } from '../lib/api';

const TENANTS_PREFIX = API_CONFIG.TENANT_PREFIX;

export const tenantService = {
  async getTenantBySubdomain(subdomain) {
    const encodedSubdomain = encodeURIComponent(subdomain);
    const response = await axiosClient.get(`${TENANTS_PREFIX}/subdomain/${encodedSubdomain}?subdomain=${encodedSubdomain}`);
    return unwrapApiData(response);
  },
};
