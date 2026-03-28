import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn, setShowModal } = useAuthContext();
  const [showCart, setShowCart] = useState(false);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);

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
    const price = typeof priceStr === 'string' ? parseFloat(priceStr.replace('$', '')) : priceStr;
    return sum + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      showCart, setShowCart,
      showAddToCartPopup, setShowAddToCartPopup,
      cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      lastAddedItem
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
