import React, { createContext, useState, useContext } from 'react';
import { toast } from 'sonner';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  const wishlistCount = wishlistItems.length;

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      toast.info('Removed from wishlist.');
    } else {
      setWishlistItems((prev) => [product, ...prev]);
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

export const useWishlistContext = () => useContext(WishlistContext);
