import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '../../user/model/AuthContext';
import { cartService } from '../../../shared/api/cartService';
import { extractErrorMessage } from '../../../shared/lib/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isLoggedIn, setShowModal, session } = useAuthContext();
  const [showCart, setShowCart] = useState(false);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const tenantId = session?.tenantId;
  const customerId = session?.userId;

  const loadCart = useCallback(async () => {
    if (!tenantId || !customerId || !isLoggedIn) {
      setCartItems([]);
      return;
    }

    try {
      setIsCartLoading(true);
      const cart = await cartService.getCart(tenantId, customerId);
      setCartItems(cart.items || []);
    } catch (error) {
      if (error?.response?.status === 404) {
        setCartItems([]);
        return;
      }
      toast.error(extractErrorMessage(error, 'Không thể tải giỏ hàng.'));
    } finally {
      setIsCartLoading(false);
    }
  }, [tenantId, customerId, isLoggedIn]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (product, quantity = 1, _color = 'Default', _size = 'Standard', showPopup = true) => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    const skuId = product?.selectedSku?.id || product?.skuId || product?.productSkuId;
    if (!skuId) {
      toast.error('Vui lòng chọn phân loại sản phẩm trước khi thêm giỏ hàng.');
      return;
    }

    try {
      await cartService.addItem(tenantId, customerId, {
        productSkuId: skuId,
        quantity,
      });

      await loadCart();
      setLastAddedItem({ ...product, quantity });
      if (showPopup) {
        setShowAddToCartPopup(true);
      } else {
        toast.success('Đã thêm vào giỏ hàng!');
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Không thể thêm vào giỏ hàng.'));
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartService.removeItem(tenantId, customerId, cartItemId);
      setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      toast.info('Đã xoá sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Không thể xoá sản phẩm.'));
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateItem(tenantId, customerId, cartItemId, { quantity: newQuantity });
      setCartItems(prev =>
        prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity, subTotal: item.price * newQuantity }
            : item,
        ),
      );
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Không thể cập nhật số lượng.'));
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart(tenantId, customerId);
      setCartItems([]);
      toast.success('Đã xoá toàn bộ giỏ hàng!');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Không thể xoá toàn bộ giỏ hàng.'));
    }
  };

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.subTotal || item.price * item.quantity || 0), 0),
    [cartItems],
  );

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{
      showCart, setShowCart,
      showAddToCartPopup, setShowAddToCartPopup,
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount,
      lastAddedItem, isCartLoading, loadCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
