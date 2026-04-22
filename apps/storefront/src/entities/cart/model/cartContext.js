import { createContext, useContext } from 'react';

export const CartContext = createContext(null);

export const useCartContext = () => useContext(CartContext);
