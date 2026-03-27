import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('tenant_token'));
  const [showCart, setShowCart] = useState(false);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  const handleQuickAdd = (product) => {
    if (product.variants && (product.variants.sizes || product.variants.colors)) {
      setQuickAddProduct(product);
    } else {
      addToCart(product);
    }
  };

  const addToCart = (product, quantity = 1, color = 'Default', size = 'Standard', showPopup = true) => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.color === color && item.size === size);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [{ ...product, quantity, color, size, cartId: Date.now() }, ...prev];
    });
    
    setLastAddedItem({ ...product, quantity, color, size });
    if (showPopup) {
      setShowAddToCartPopup(true);
    } else {
      toast.success('Đã thêm vào giỏ hàng!');
    }
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    toast.info('Đã xoá sản phẩm khỏi giỏ hàng');
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item));
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const priceStr = item.price || '$0.00';
    const price = parseFloat(priceStr.replace('$', ''));
    return sum + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      showModal, setShowModal,
      isLoggedIn, setIsLoggedIn,
      showCart, setShowCart,
      showAddToCartPopup, setShowAddToCartPopup,
      cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      quickAddProduct, setQuickAddProduct, handleQuickAdd,
      selectedProduct, setSelectedProduct,
      lastAddedItem
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
