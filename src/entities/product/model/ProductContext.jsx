import React, { createContext, useState, useContext } from 'react';
import { useCartContext } from '../../cart/model/CartContext';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const { addToCart } = useCartContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  const handleQuickAdd = (product) => {
    const attrs = product.attributes || {};
    const hasSelectableAttrs = Object.values(attrs).some(v => Array.isArray(v) && v.length > 0);
    if (hasSelectableAttrs) {
      setQuickAddProduct(product);
    } else {
      addToCart(product);
    }
  };

  return (
    <ProductContext.Provider value={{
      selectedProduct, setSelectedProduct,
      quickAddProduct, setQuickAddProduct,
      handleQuickAdd
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => useContext(ProductContext);
