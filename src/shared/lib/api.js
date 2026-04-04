export const unwrapApiData = (payload) => {
  if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }
  return payload;
};

export const extractErrorMessage = (error, fallback = 'Có lỗi xảy ra, vui lòng thử lại.') => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallback;

  const fieldErrors = error?.response?.data?.errors;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const firstField = Object.keys(fieldErrors)[0];
    const firstError = fieldErrors[firstField]?.[0];
    if (firstError) return firstError;
  }

  return message;
};

export const normalizeApiList = (payload) => {
  const data = unwrapApiData(payload);
  return Array.isArray(data) ? data : [];
};
