import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  addWishlistItem,
  removeWishlistItem,
} from '../store/slices/wishlistSlice';
import { WishlistContext } from './wishlistContext';

export function WishlistProvider({ children }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const wishlistCount = wishlistItems.length;

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      dispatch(removeWishlistItem(product.id));
      toast.info('Removed from wishlist.');
    } else {
      dispatch(addWishlistItem(product));
      toast.success('Added to wishlist! ❤️');
    }
  };

  const isWishlisted = (productId) => wishlistItems.some((item) => item.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistCount, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}
