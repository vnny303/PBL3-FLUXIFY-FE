import React, { createContext, useState, useContext, useEffect } from 'react';
import { useCartContext } from '../../entities/cart/model/CartContext';
import { useStorefrontTenant } from '../../features/theme/useStorefrontTenant';
import { productService } from '../../shared/api/productService';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { addToCart } = useCartContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  // New states for inventory
  const { tenantId } = useStorefrontTenant();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [inventoryError, setInventoryError] = useState(null);

  useEffect(() => {
    if (!tenantId) return;

    setIsLoadingInventory(true);
    setInventoryError(null);

    Promise.allSettled([
      productService.getCategories(tenantId),
      productService.getProducts(tenantId)
    ])
      .then(([categoriesRes, productsRes]) => {
        let hasError = false;
        let errorMessage = "Không thể tải ";

        if (categoriesRes.status === 'fulfilled') {
          setCategories(categoriesRes.value || []);
        } else {
          setCategories([]);
          hasError = true;
          errorMessage += "danh mục ";
          console.error("Fetch categories failed:", categoriesRes.reason);
        }

        if (productsRes.status === 'fulfilled') {
          // Fallback array just in case
          setProducts(productsRes.value || []);
        } else {
          setProducts([]);
          hasError = true;
          errorMessage += (categoriesRes.status !== 'fulfilled' ? "và " : "") + "sản phẩm";
          console.error("Fetch products failed:", productsRes.reason);
        }

        if (hasError) {
          setInventoryError(errorMessage);
        }
      })
      .finally(() => {
        setIsLoadingInventory(false);
      });
  }, [tenantId]);


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
      setQuickAddProduct(productWithSkus);
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

export const useProductContext = () => useContext(ProductContext);
