import { useState, useEffect } from 'react';
import { getStorefrontSubdomain } from '../../shared/lib/getStorefrontSubdomain';
import { authService } from '../../shared/api/authService';

let cachedTenantPromise = null;
let cachedTenantData = null;

export const useStorefrontTenant = () => {
  const initialSubdomain = getStorefrontSubdomain();
  const [tenantState, setTenantState] = useState({
    tenant: cachedTenantData,
    tenantId: cachedTenantData?.id || null,
    storeName: cachedTenantData?.storeName || null,
    subdomain: cachedTenantData?.subdomain || initialSubdomain || null,
    isLoadingTenant: !cachedTenantData && Boolean(initialSubdomain),
    tenantError: !cachedTenantData && !initialSubdomain ? 'Không tìm thấy subdomain' : null,
  });

  useEffect(() => {
    if (cachedTenantData) {
      return;
    }

    if (!initialSubdomain) {
      return;
    }

    if (!cachedTenantPromise) {
      cachedTenantPromise = authService.getTenantBySubdomain(initialSubdomain)
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
  }, [initialSubdomain]);

  return tenantState;
};
