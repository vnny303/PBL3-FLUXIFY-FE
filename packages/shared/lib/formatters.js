export const formatVnd = (amount) => {
  const numericAmount = typeof amount === 'number' 
    ? amount 
    : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
  
  return new Intl.NumberFormat('vi-VN').format(Math.round(numericAmount)) + 'đ';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(dateString));
  } catch (e) {
    return dateString;
  }
};
