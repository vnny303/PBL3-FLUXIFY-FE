import React, { createContext, useState, useContext } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));

  return (
    <AuthContext.Provider value={{ showModal, setShowModal, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
