// ─── Pagination ───────────────────────────────────────────────────────────────
export const ITEMS_PER_PAGE = 12;

// ─── Price Filter ─────────────────────────────────────────────────────────────
export const PRICE_RANGE_MIN = 0;
export const PRICE_RANGE_MAX = 500000;

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
};

// ─── Local Storage Keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tenant_token',
  USER_ID: 'userId',
  TENANT_ID: 'tenantId',
  TENANT_SUBDOMAIN: 'tenant_subdomain',
};
