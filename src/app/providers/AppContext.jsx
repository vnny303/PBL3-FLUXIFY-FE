import React, { useContext } from 'react';
import { AuthProvider, useAuthContext } from '../../entities/user/model/AuthContext';
import { CartProvider, useCartContext } from '../../entities/cart/model/CartContext';
import { WishlistProvider, useWishlistContext } from './WishlistContext';
import { SearchProvider, useSearchContext } from './SearchContext';
import { ProductProvider, useProductContext } from '../../entities/product/model/ProductContext';

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
