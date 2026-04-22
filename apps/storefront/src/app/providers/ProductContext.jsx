import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCartContext } from '../../entities/cart/model/cartContext';
import { useStorefrontTenant } from '../../features/theme/useStorefrontTenant';
import { productService } from '../../shared/api/productService';
import { ProductContext } from './productContext';
import {
  fetchInventory,
  resetInventory,
  setQuickAddProduct as setQuickAddProductAction,
  setSelectedProduct as setSelectedProductAction,
} from '../store/slices/productSlice';

export function ProductProvider({ children }) {
  const { addToCart } = useCartContext();
  const dispatch = useDispatch();
  const {
    selectedProduct,
    quickAddProduct,
    products,
    categories,
    isLoadingInventory,
    inventoryError,
  } = useSelector((state) => state.product);

  const { tenantId } = useStorefrontTenant();

  useEffect(() => {
    if (!tenantId) {
      dispatch(resetInventory());
      return;
    }

    dispatch(fetchInventory(tenantId));
  }, [dispatch, tenantId]);

  const setSelectedProduct = (product) => {
    dispatch(setSelectedProductAction(product));
  };

  const setQuickAddProduct = (product) => {
    dispatch(setQuickAddProductAction(product));
  };

  const handleQuickAdd = async (product) => {
    let productWithSkus = product;
    if (!productWithSkus.skus || productWithSkus.skus.length === 0) {
      try {
        productWithSkus = await productService.getProductById(tenantId, product.id);
      } catch (error) {
        console.error("Failed to fetch product details for quick add:", error);
      }
    }

    const attrs = productWithSkus.attributes || {};
    const hasSelectableAttrs = Object.values(attrs).some(v => Array.isArray(v) && v.length > 0);
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
