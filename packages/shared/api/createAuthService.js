const DEFAULT_AUTH_BASE_PATH = "/api/auth";

export const createAuthService = (client, options = {}) => {
  const authBasePath = options.authBasePath || DEFAULT_AUTH_BASE_PATH;

  return {
    registerCustomer: ({ subdomain, email, password }) =>
      client.post(`${authBasePath}/customer/register`, { email, password }, {
        params: { subdomain },
      }),

    loginCustomer: ({ subdomain, email, password }) =>
      client.post(`${authBasePath}/customer/login`, { email, password }, {
        params: { subdomain },
      }),

    loginMerchant: ({ email, password }) =>
      client.post(`${authBasePath}/merchant/login`, { email, password }),

    registerMerchant: ({ fullName, email, password, storeName, subdomain }) =>
      client.post(`${authBasePath}/merchant/register`, {
        fullName,
        email,
        password,
        storeName,
        subdomain,
      }),

    getCurrentUser: () => client.get(`${authBasePath}/me`),

    logout: () => client.post(`${authBasePath}/logout`),

    getTenantBySubdomain: (subdomain) =>
      client.get(`/api/tenants/subdomain/${encodeURIComponent(subdomain)}`),

    getMyTenants: () => client.get("/api/tenants/me"),
  };
};
