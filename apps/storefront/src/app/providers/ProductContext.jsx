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
    if (pFail && cFail) return 'Failed to load categories and products';
    if (cFail) return 'Failed to load categories';
    if (pFail) return 'Failed to load products';
    return null;
  })();

  const setSelectedProduct = (product) => dispatch(setSelectedProductAction(product));
  const setQuickAddProduct = (product) => dispatch(setQuickAddProductAction(product));

  const handleQuickAdd = async (product) => {
    if (!product) return;
    
    let productWithSkus = product;
    
    // 1. Ensure we have SKU data
    const currentSkus = productWithSkus.productSkus || productWithSkus.skus || [];
    if (currentSkus.length === 0) {
      try {
        console.log('[QuickAdd] Fetching full product details for:', product.id);
        const detailed = await productService.getProductById(tenantId, product.id);
        if (detailed) productWithSkus = detailed;
      } catch (error) {
        console.error('[QuickAdd] Failed to fetch product details:', error);
      }
    }

    // 2. Validate product data after potential fetch
    if (!productWithSkus) return;

    const skus = productWithSkus.productSkus || productWithSkus.skus || [];
    const inStockSkus = skus.filter(s => (s && (s.stockQuantity ?? s.stock)) > 0);
    
    if (inStockSkus.length === 0) {
      console.warn('[QuickAdd] No in-stock SKUs found for:', productWithSkus.name);
      return;
    }

    // 3. Logic: Direct add if exactly one SKU, otherwise open Modal
    if (inStockSkus.length === 1) {
      if (addToCart) {
        addToCart(productWithSkus, inStockSkus[0]);
      } else {
        console.error('[QuickAdd] addToCart function is missing!');
      }
    } else {
      console.log('[QuickAdd] Opening Modal for multiple variants:', productWithSkus.name);
      dispatch(setQuickAddProductAction(productWithSkus));
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
        addToCart, // <--- EXPOSE THIS
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
