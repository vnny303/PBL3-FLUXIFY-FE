import React from 'react';
import { AuthProvider } from '../../entities/user/model/AuthContext.jsx';
import { CartProvider } from '../../entities/cart/model/CartContext.jsx';
import { WishlistProvider } from './WishlistContext.jsx';
import { SearchProvider } from './SearchContext.jsx';
import { ProductProvider } from './ProductContext.jsx';

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
