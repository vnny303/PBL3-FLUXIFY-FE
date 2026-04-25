const normalizeToken = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');

export const normalizePaymentMethod = (value) => {
  const token = normalizeToken(value);
  if (!token) return null;

  if (token === 'banktransfer' || token === 'bank') {
    return 'BankTransfer';
  }

  if (token === 'cod' || token === 'cashondelivery') {
    return 'COD';
  }

  return value;
};

export const isBankTransferMethod = (value) =>
  normalizePaymentMethod(value) === 'BankTransfer';

export const getPaymentMethodLabel = (value) =>
  normalizePaymentMethod(value) === 'COD' ? 'COD' : 'Bank Transfer';
