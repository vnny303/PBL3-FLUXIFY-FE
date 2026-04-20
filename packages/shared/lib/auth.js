//Quản lý session đăng nhập ở frontend
const STORAGE_KEYS = {
  TOKEN: "tenant_token",
  USER_ID: "userId",
  TENANT_ID: "tenantId",
  SUBDOMAIN: "tenant_subdomain",
  ROLE: "auth_role",
  EMAIL: "auth_email",
};

//Kiểm tra xem code hiện tại có đang chạy ở môi trường có window.localStorage hay không.
const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const read = (key) => {
  if (!canUseStorage()) {
    return null;
  }
  return window.localStorage.getItem(key);
};

const write = (key, value) => {
  if (!canUseStorage()) {
    return;
  }
  if (value === undefined || value === null || value === "") {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, String(value));
};

const pickTenantFromResponse = (authResponse) => {
  //customer auth
  if (authResponse?.tenantId) {
    return {
      tenantId: authResponse.tenantId,
      subdomain: authResponse.subdomain || null,
    };
  }
  //merchant auth
  if (Array.isArray(authResponse?.tenants) && authResponse.tenants.length > 0) {
    const firstTenant = authResponse.tenants[0];
    return {
      tenantId: firstTenant.tenantId || firstTenant.id || null,
      subdomain: firstTenant.subdomain || null,
    };
  }

  return { tenantId: null, subdomain: null };
};

export const getToken = () => read(STORAGE_KEYS.TOKEN);
export const getUserId = () => read(STORAGE_KEYS.USER_ID);
export const getTenantId = () => read(STORAGE_KEYS.TENANT_ID);
export const getRole = () => read(STORAGE_KEYS.ROLE);
export const getSubdomain = () => read(STORAGE_KEYS.SUBDOMAIN);

export const setToken = (token) => write(STORAGE_KEYS.TOKEN, token);

export const clearAuthSession = () => {
  if (!canUseStorage()) {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

//luu session 
export const setAuthSession = (authResponse) => {
  if (!authResponse) {
    return;
  }

  const tenantMeta = pickTenantFromResponse(authResponse);

  write(STORAGE_KEYS.TOKEN, authResponse.token);
  write(STORAGE_KEYS.USER_ID, authResponse.userId);
  write(STORAGE_KEYS.ROLE, authResponse.role);
  write(STORAGE_KEYS.EMAIL, authResponse.email);
  write(STORAGE_KEYS.TENANT_ID, tenantMeta.tenantId);
  write(STORAGE_KEYS.SUBDOMAIN, tenantMeta.subdomain);
};

export const getAuthSession = () => ({
  token: read(STORAGE_KEYS.TOKEN),
  userId: read(STORAGE_KEYS.USER_ID),
  tenantId: read(STORAGE_KEYS.TENANT_ID),
  subdomain: read(STORAGE_KEYS.SUBDOMAIN),
  role: read(STORAGE_KEYS.ROLE),
  email: read(STORAGE_KEYS.EMAIL),
});

export const isAuthenticated = () => Boolean(getToken());

export const STORAGE = STORAGE_KEYS;
