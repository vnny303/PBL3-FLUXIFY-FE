/**
 * Unified currency and number formatters for the storefront.
 * Uses shared logic from @fluxify/shared.
 */
import { formatVnd as sharedFormatVnd } from '@fluxify/shared';

export const formatVnd = (amount) => sharedFormatVnd(amount);

export const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[đ$₫,]/g, '')) || 0;
  }
  return 0;
};

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
