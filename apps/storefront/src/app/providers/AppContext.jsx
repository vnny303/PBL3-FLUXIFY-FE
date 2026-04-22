/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { AuthProvider } from '../../entities/user/model/AuthContext';
import { useAuthContext } from '../../entities/user/model/authContext';
import { CartProvider } from '../../entities/cart/model/CartContext';
import { useCartContext } from '../../entities/cart/model/cartContext';
import { WishlistProvider } from './WishlistContext';
import { useWishlistContext } from './wishlistContext';
import { SearchProvider } from './SearchContext';
import { useSearchContext } from './searchContext';
import { ProductProvider } from './ProductContext';
import { useProductContext } from './productContext';

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <WishlistProvider>
          <CartProvider>
            <ProductProvider>{children}</ProductProvider>
          </CartProvider>
        </WishlistProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export const useAppContext = () => {
  const auth = useAuthContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();
  const search = useSearchContext();
  const product = useProductContext();

  return {
    ...auth,
    ...cart,
    ...wishlist,
    ...search,
    ...product,
  };
};
