import { createContext, useContext } from 'react';

export const ProductContext = createContext(null);

export const useProductContext = () => useContext(ProductContext);
