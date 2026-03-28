import React, { createContext, useState, useContext } from 'react';
import { useCartContext } from './CartContext';

const UIContext = createContext();

export function UIProvider({ children }) {
  const { addToCart } = useCartContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  const handleQuickAdd = (product) => {
    if (product.variants && (product.variants.sizes || product.variants.colors)) {
      setQuickAddProduct(product);
    } else {
      addToCart(product);
    }
  };

  return (
    <UIContext.Provider value={{
      selectedProduct, setSelectedProduct,
      quickAddProduct, setQuickAddProduct,
      handleQuickAdd
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUIContext = () => useContext(UIContext);
