import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useCartContext } from '../../cart/model/CartContext';
import { useAuthContext } from '../../user/model/AuthContext';
import { tenantService } from '../../../shared/api/tenantService';
import { productService } from '../../../shared/api/productService';
import { extractErrorMessage } from '../../../shared/lib/api';
import { normalizeSubdomain, resolveActiveSubdomain, STORAGE_KEYS } from '../../../shared/lib/constants';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { addToCart } = useCartContext();
  const { session } = useAuthContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [storeError, setStoreError] = useState(null);

  const refreshStoreData = useCallback(async (targetSubdomain = '') => {
    const preferredSubdomain = resolveActiveSubdomain(
      normalizeSubdomain(targetSubdomain),
      normalizeSubdomain(localStorage.getItem(STORAGE_KEYS.SUBDOMAIN)),
      normalizeSubdomain(session?.subdomain),
      normalizeSubdomain(import.meta.env.VITE_DEFAULT_SUBDOMAIN),
    );

    if (!preferredSubdomain) {
      setTenant(null);
      setCategories([]);
      setProducts([]);
      return;
    }
    setLoadingProducts(true);
    setStoreError(null);

    try {
      const tenantData = await tenantService.getTenantBySubdomain(preferredSubdomain);
      const resolvedSubdomain = resolveActiveSubdomain(tenantData?.subdomain, preferredSubdomain);

      const currentStoredSubdomain = normalizeSubdomain(localStorage.getItem(STORAGE_KEYS.SUBDOMAIN));
      if (resolvedSubdomain && currentStoredSubdomain !== resolvedSubdomain) {
        localStorage.setItem(STORAGE_KEYS.SUBDOMAIN, resolvedSubdomain);
      }

      setTenant({ ...tenantData, subdomain: resolvedSubdomain });

      const [categoryData, productData] = await Promise.all([
        productService.getCategories(tenantData.id, { subdomain: resolvedSubdomain }),
        productService.getProducts(tenantData.id, { subdomain: resolvedSubdomain }),
      ]);

      setCategories(categoryData);
      setProducts(productData);
    } catch (error) {
      setTenant(null);
      setCategories([]);
      setProducts([]);
      setStoreError(extractErrorMessage(error, 'Không thể tải dữ liệu cửa hàng.'));
    } finally {
      setLoadingProducts(false);
    }
  }, [session?.subdomain]);

  useEffect(() => {
    refreshStoreData();
  }, [refreshStoreData]);

  const handleQuickAdd = (product) => {
    if (product.skus?.length) {
      setQuickAddProduct(product);
    } else {
      addToCart(product);
    }
  };

  return (
    <ProductContext.Provider value={{
      selectedProduct, setSelectedProduct,
      quickAddProduct, setQuickAddProduct,
      handleQuickAdd,
      tenant,
      products,
      categories,
      loadingProducts,
      storeError,
      refreshStoreData,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
