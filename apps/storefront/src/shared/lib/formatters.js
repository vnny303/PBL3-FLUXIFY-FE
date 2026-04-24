/**
 * Unified currency and number formatters for the storefront.
 * Uses VND as the base currency.
 */

const VND_LOCALE = 'vi-VN';

/**
 * Formats a number or numeric string into VND currency format (e.g., 149,000đ).
 * @param {number|string} amount - The amount to format.
 * @returns {string} Formatted VND string.
 */
export const formatVnd = (amount) => {
  const numericAmount = typeof amount === 'number' 
    ? amount 
    : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
  
  return new Intl.NumberFormat(VND_LOCALE).format(Math.round(numericAmount)) + 'đ';
};

/**
 * Parses a string value (possibly containing currency symbols) into a clean number.
 * @param {any} value - The value to parse.
 * @returns {number} Clean numeric value.
 */
export const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Remove symbols and commas, keep decimal if any
    return parseFloat(value.replace(/[đ$₫,]/g, '')) || 0;
  }
  return 0;
};

/**
 * Returns a displayable order code.
 * If the order has a code, uses it. 
 * If it's a UUID, generates a deterministic short code: FLX-YYMMDD-XXXX
 */
export const getDisplayOrderCode = (order) => {
  if (!order) return 'N/A';
  if (order.orderCode) return order.orderCode;
  
  const id = order.id || '';
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(id);
  
  if (isUuid) {
    const date = order.createdAt ? new Date(order.createdAt) : new Date();
    const datePart = date.toISOString().slice(2, 10).replace(/-/g, '');
    const hashPart = id.slice(0, 4).toUpperCase();
    return `FLX-${datePart}-${hashPart}`;
  }
  
  return id;
};
