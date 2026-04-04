export const getVariantGroups = (product) => {
  const groups = {};
  const skus = Array.isArray(product?.skus) ? product.skus : [];

  for (const sku of skus) {
    const attrs = sku.attributes || {};
    for (const [key, value] of Object.entries(attrs)) {
      if (!groups[key]) groups[key] = new Set();
      groups[key].add(String(value));
    }
  }

  return Object.fromEntries(
    Object.entries(groups).map(([key, values]) => [key, Array.from(values)]),
  );
};

export const findSkuBySelection = (product, selectedAttributes) => {
  const skus = Array.isArray(product?.skus) ? product.skus : [];

  return skus.find((sku) => {
    const attrs = sku.attributes || {};
    return Object.entries(selectedAttributes).every(([key, value]) => {
      if (!value) return true;
      return String(attrs[key]) === String(value);
    });
  }) || null;
};

export const getLowestPriceSku = (product) => {
  const skus = Array.isArray(product?.skus) ? product.skus : [];
  return skus.reduce((best, sku) => (best === null || sku.price < best.price ? sku : best), null);
};
