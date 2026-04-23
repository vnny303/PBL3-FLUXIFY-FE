import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useCartContext } from '../../entities/cart/model/cartContext';
import { useStorefrontTenant } from '../../features/theme/useStorefrontTenant';
import { productService } from '../../shared/api/productService';
import { ProductContext } from './productContext';
import {
  setQuickAddProduct as setQuickAddProductAction,
  setSelectedProduct as setSelectedProductAction,
} from '../store/slices/productSlice';

export function ProductProvider({ children }) {
  const { addToCart } = useCartContext();
  const dispatch = useDispatch();
  const { selectedProduct, quickAddProduct } = useSelector((state) => state.product);
  const { tenantId } = useStorefrontTenant();

  // Fetch products — thay AsyncThunk
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ['inventory-products', tenantId],
    queryFn: () => productService.getProducts(tenantId),
    enabled: !!tenantId,
    staleTime: 60_000, // Cache 60 giây — catalog không thay đổi thường xuyên
  });

  // Fetch categories — thay AsyncThunk
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['inventory-categories', tenantId],
    queryFn: () => productService.getCategories(tenantId),
    enabled: !!tenantId,
    staleTime: 60_000,
  });

  const isLoadingInventory = isLoadingProducts || isLoadingCategories;

  const inventoryError = (() => {
    const pFail = !!productsError;
    const cFail = !!categoriesError;
    if (pFail && cFail) return 'Không thể tải danh mục và sản phẩm';
    if (cFail) return 'Không thể tải danh mục';
    if (pFail) return 'Không thể tải sản phẩm';
    return null;
  })();

  const setSelectedProduct = (product) => dispatch(setSelectedProductAction(product));
  const setQuickAddProduct = (product) => dispatch(setQuickAddProductAction(product));

  const handleQuickAdd = async (product) => {
    let productWithSkus = product;
    if (!productWithSkus.skus || productWithSkus.skus.length === 0) {
      try {
        productWithSkus = await productService.getProductById(tenantId, product.id);
      } catch (error) {
        console.error('Failed to fetch product details for quick add:', error);
      }
    }

    const attrs = productWithSkus.attributes || {};
    const hasSelectableAttrs = Object.values(attrs).some((v) => Array.isArray(v) && v.length > 0);
    if (hasSelectableAttrs) {
      dispatch(setQuickAddProductAction(productWithSkus));
    } else {
      addToCart(productWithSkus, productWithSkus.skus?.[0]);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        selectedProduct,
        setSelectedProduct,
        quickAddProduct,
        setQuickAddProduct,
        handleQuickAdd,
        products,
        categories,
        isLoadingInventory,
        inventoryError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
