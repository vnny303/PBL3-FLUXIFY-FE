import { useState, useEffect } from 'react';
import { getStorefrontSubdomain } from '../../shared/lib/getStorefrontSubdomain';
import { authService } from '../../shared/api/authService';

let cachedTenantPromise = null;
let cachedTenantData = null;

export const useStorefrontTenant = () => {
  const [tenantState, setTenantState] = useState({
    tenant: cachedTenantData,
    tenantId: cachedTenantData?.id || null,
    storeName: cachedTenantData?.storeName || null,
    subdomain: cachedTenantData?.subdomain || null,
    isLoadingTenant: !cachedTenantData,
    tenantError: null,
  });

  useEffect(() => {
    if (cachedTenantData) {
      return;
    }

    const subdomain = getStorefrontSubdomain();
    if (!subdomain) {
      setTenantState(prev => ({ ...prev, isLoadingTenant: false, tenantError: 'Không tìm thấy subdomain' }));
      return;
    }

    if (!cachedTenantPromise) {
      cachedTenantPromise = authService.getTenantBySubdomain(subdomain)
        .then(res => {
          cachedTenantData = res;
          return res;
        });
    }

    cachedTenantPromise
      .then(res => {
        setTenantState({
          tenant: res,
          tenantId: res.id,
          storeName: res.storeName,
          subdomain: res.subdomain,
          isLoadingTenant: false,
          tenantError: null,
        });
      })
      .catch(err => {
        setTenantState(prev => ({
          ...prev,
          isLoadingTenant: false,
          tenantError: err?.response?.data?.message || 'Không tìm thấy cửa hàng'
        }));
      });
  }, []);

  return tenantState;
};
