const VND_PER_USD = 1; 
const ENABLE_LIVE_BANK_QR = import.meta.env.VITE_ENABLE_LIVE_BANK_QR === 'true' || true;

const DEFAULT_BANK = {
  bankName: 'Vietinbank',
  bankCode: 'VIETINBANK',
  bankAccountNumber: '104882409227',
  bankAccountName: 'VAN NGOC NHU Y STORE',
};

// Generates a short, human-readable code: FLX-YYMMDD-XXXX
export const buildOrderCode = (prefix = 'FLX') => {
  const now = new Date();
  const dateStr = now.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
  const randomStr = Math.floor(1000 + Math.random() * 9000); // 4 random digits
  return `${prefix}-${dateStr}-${randomStr}`;
};

export const createBankTransferInfo = ({
  orderCode,
  totalAmount,
  paymentStatus = 'Pending',
  paidAt = null,
} = {}) => {
  // If orderCode is a UUID, we prefer our short mock code for easier manual typing
  const isUuid = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(str);
  const safeOrderCode = (!orderCode || isUuid(orderCode)) ? buildOrderCode('FLX') : orderCode;
  
  const safeAmount = Math.max(0, Number(totalAmount) || 0);

  return {
    orderCode: safeOrderCode,
    paymentMethod: 'BankTransfer',
    paymentStatus,
    ...DEFAULT_BANK,
    transferContent: safeOrderCode,
    totalAmount: safeAmount,
    totalAmountVnd: Math.max(0, Math.round(safeAmount * VND_PER_USD)),
    paidAt,
  };
};

export const getBankTransferQrUrl = (bankInfo) => {
  if (!ENABLE_LIVE_BANK_QR || !bankInfo) return null;

  const amountVnd = Number(bankInfo.totalAmountVnd) || 0;
  const bankCode = bankInfo.bankCode;
  const accountNumber = bankInfo.bankAccountNumber;
  const accountName = bankInfo.bankAccountName || '';
  const transferContent = bankInfo.transferContent || '';

  if (!bankCode || !accountNumber || amountVnd <= 0) return null;

  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amountVnd}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;
};
