import React, { useContext } from 'react';
import { AuthProvider, useAuthContext } from './AuthContext';
import { CartProvider, useCartContext } from './CartContext';
import { WishlistProvider, useWishlistContext } from './WishlistContext';
import { SearchProvider, useSearchContext } from './SearchContext';
import { UIProvider, useUIContext } from './UIContext';

// Keep AppProvider as a single wrapper for main.jsx
export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>
        <WishlistProvider>
          {/* CartProvider needs AuthProvider */}
          <CartProvider>
            {/* UIProvider needs CartProvider (for QuickAdd -> addToCart) */}
            <UIProvider>
              {children}
            </UIProvider>
          </CartProvider>
        </WishlistProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

// Keep useAppContext for backward compatibility, but it now aggregates all contexts
export const useAppContext = () => {
  const auth = useAuthContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();
  const search = useSearchContext();
  const ui = useUIContext();

  // If used outside providers, these might be null. 
  // We assume AppProvider wraps the whole app.
  return {
    ...auth,
    ...cart,
    ...wishlist,
    ...search,
    ...ui
  };
};
