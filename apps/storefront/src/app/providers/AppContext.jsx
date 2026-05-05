import React from 'react';
import { AuthProvider } from '../../entities/user/model/AuthContext.jsx';
import { CartProvider } from '../../entities/cart/model/CartContext.jsx';

import { SearchProvider } from './SearchContext.jsx';
import { ProductProvider } from './ProductContext.jsx';

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>
          <CartProvider>
            <ProductProvider>{children}</ProductProvider>
          </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
