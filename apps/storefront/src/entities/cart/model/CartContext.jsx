import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '../../user/model/AuthContext';
import { useStorefrontTenant } from '../../../features/theme/useStorefrontTenant';
import { cartService } from '../../../shared/api/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn, setShowModal, user } = useAuthContext();
  const { tenantId } = useStorefrontTenant();
  
  const [showCart, setShowCart] = useState(false);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  // Re-sync with Backend
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !user?.userId || !tenantId) {
      setCartItems([]);
      return;
    }
    try {
      setIsLoadingCart(true);
      const response = await cartService.getCart(tenantId, user.userId);
      const items = Array.isArray(response) ? response : (response?.items || []);
      
      const normalizedItems = items.map(apiItem => ({
        cartId: apiItem.id || apiItem.itemId, // Backend Cart Item ID
        productId: apiItem.product?.id || apiItem.productId,
        productSkuId: apiItem.productSkuId || apiItem.productSku?.id || apiItem.product?.id,
        productName: apiItem.product?.name || apiItem.productName || 'Unknown Product',
        price: apiItem.productSku?.price ?? apiItem.product?.price ?? apiItem.price ?? 0,
        quantity: apiItem.quantity || 1,
        skuAttributes: apiItem.productSku?.attributes || apiItem.skuAttributes || {},
        image: apiItem.productSku?.imgUrl || apiItem.productSku?.image || apiItem.product?.imgUrls?.[0] || apiItem.product?.images?.[0] || apiItem.image || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000',
      }));
      setCartItems(normalizedItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoadingCart(false);
    }
  }, [isLoggedIn, user?.userId, tenantId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, selectedSku, quantity = 1, selectedAttributes = {}, showPopup = true) => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }
    
    const skuId = selectedSku?.id || product.productSkuId || product.id;

    // Optimistic Update
    setCartItems(prev => {
      const existing = prev.find(item => item.productSkuId === skuId);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item);
      }
      
      const price = selectedSku?.price ?? product.price ?? 0;
      const parsedPrice = typeof price === 'number' ? price : parseFloat(price.replace('$', '')) || 0;
      
      const cartItem = {
        cartId: `temp-${Date.now()}`,
        id: product.id,
        productSkuId: skuId,
        productId: product.productId || product.id,
        productName: product.name || product.productName,
        price: parsedPrice,
        quantity,
        skuAttributes: selectedAttributes,
        image: selectedSku?.imgUrl || selectedSku?.image || product.image || product.imgUrls?.[0],
      };
      return [cartItem, ...prev];
    });
    
    setLastAddedItem({ ...product, quantity, attributes: selectedAttributes });
    if (showPopup) {
      setShowAddToCartPopup(true);
    } else {
      toast.success('Đã thêm vào giỏ hàng!');
    }

    // Server Sync
    try {
      await cartService.addToCart(tenantId, user.userId, { productSkuId: skuId, quantity });
      fetchCart(); // Refetch to get true ID
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng');
      fetchCart(); // Rollback local state
    }
  };

  const removeFromCart = async (cartId) => {
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    toast.info('Đã xoá sản phẩm khỏi giỏ hàng');

    if (String(cartId).startsWith('temp-')) return;
    try {
      await cartService.removeFromCart(tenantId, user.userId, cartId);
    } catch (error) {
      toast.error('Lỗi khi xoá sản phẩm');
      setCartItems(previousItems); // Rollback
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const previousItems = [...cartItems];
    setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item));

    if (String(cartId).startsWith('temp-')) return;
    try {
      await cartService.updateCartItem(tenantId, user.userId, cartId, { quantity: newQuantity });
    } catch (error) {
      toast.error('Lỗi khi cập nhật số lượng');
      setCartItems(previousItems); // Rollback
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      showCart, setShowCart,
      showAddToCartPopup, setShowAddToCartPopup,
      cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount,
      lastAddedItem, isLoadingCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
