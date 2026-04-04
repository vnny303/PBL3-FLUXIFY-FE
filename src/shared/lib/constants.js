// ─── Pagination ───────────────────────────────────────────────────────────────
export const ITEMS_PER_PAGE = 12;

// ─── Price Filter ─────────────────────────────────────────────────────────────
export const PRICE_RANGE_MIN = 0;
export const PRICE_RANGE_MAX = 500;

// ─── Sort Options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  'Newest Arrivals',
  'Price: Low to High',
  'Price: High to Low',
  'Best Selling',
];

// ─── Account Screens ──────────────────────────────────────────────────────────
export const ACCOUNT_SCREENS = {
  MY_ORDERS: 'my-orders',
  SAVED_ADDRESSES: 'saved-addresses',
  PROFILE_SETTINGS: 'profile-settings',
  NOTIFICATIONS: 'notifications',
};

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product',
  ABOUT: '/about',
  CONTACT: '/contact',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order-confirmation',
  ACCOUNT: '/account',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  SIGNUP: '/signup',
  MERCHANT_LOGIN: '/merchant/login',
  MERCHANT_HOME: '/merchant',
};

const SUBDOMAIN_SEGMENT_PREFIX = 'subdomain=';

export const normalizeSubdomain = (value) => String(value || '').trim().toLowerCase();

export const parseSubdomainSegment = (segmentValue) => {
  const decoded = decodeURIComponent(String(segmentValue || ''));
  if (!decoded) return '';

  if (decoded.startsWith(SUBDOMAIN_SEGMENT_PREFIX)) {
    return normalizeSubdomain(decoded.slice(SUBDOMAIN_SEGMENT_PREFIX.length));
  }

  return normalizeSubdomain(decoded);
};

export const extractSubdomainFromPath = (pathname) => {
  const normalizedPath = String(pathname || '');
  const segments = normalizedPath.split('/').filter(Boolean);
  if (segments.length < 2) return '';

  const token = segments[1];
  return parseSubdomainSegment(token);
};

export const resolveActiveSubdomain = (...values) => {
  for (const value of values) {
    const normalized = normalizeSubdomain(value);
    if (normalized) return normalized;
  }
  return '';
};

export const buildShopPath = (subdomain) => {
  const normalized = normalizeSubdomain(subdomain);
  return normalized ? `${ROUTES.SHOP}/${SUBDOMAIN_SEGMENT_PREFIX}${encodeURIComponent(normalized)}` : ROUTES.SHOP;
};

export const buildLoginPath = (subdomain) => {
  const normalized = normalizeSubdomain(subdomain);
  return normalized ? `${ROUTES.LOGIN}/${SUBDOMAIN_SEGMENT_PREFIX}${encodeURIComponent(normalized)}` : ROUTES.LOGIN;
};

// ─── Local Storage Keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tenant_token',
  AUTH_SESSION: 'fluxify_auth_session',
  SUBDOMAIN: 'tenant_subdomain',
  TENANT_ID: 'tenant_id',
  CUSTOMER_ID: 'customer_id',
};

// ─── API Config ───────────────────────────────────────────────────────────────
export const API_CONFIG = {
  AUTH_PREFIX: import.meta.env.VITE_AUTH_PREFIX || '/api/simpleauth',
  TENANT_PREFIX: '/api/tenants',
};

// ─── UI Defaults ──────────────────────────────────────────────────────────────
export const FALLBACK_PRODUCT_IMAGE = 'https://picsum.photos/seed/fluxify-product/600/600';

export const PAYMENT_METHODS = {
  COD: 'COD',
  BANK_TRANSFER: 'BankTransfer',
  MOMO: 'MoMo',
};

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'];
