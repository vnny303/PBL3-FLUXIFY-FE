import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  clearAuthSession,
  getAuthSession,
  getToken,
  setAuthSession,
} from '@fluxify/shared/lib';
import { authService } from '../../../shared/api/authService';

const AuthContext = createContext();
const CUSTOMER_ROLE = 'customer';

export function AuthProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedInState] = useState(Boolean(getToken()));
  const [isHydrating, setIsHydrating] = useState(true);
  const [user, setUser] = useState(() => {
    const snapshot = getAuthSession();
    if (!snapshot.userId) {
      return null;
    }

    return {
      userId: snapshot.userId,
      email: snapshot.email,
      role: snapshot.role,
      tenantId: snapshot.tenantId,
    };
  });

  const setIsLoggedIn = useCallback((value) => {
    const nextValue = Boolean(value);
    setIsLoggedInState(nextValue);
    if (!nextValue) {
      clearAuthSession();
      setUser(null);
    }
  }, []);

  const applyAuthResponse = useCallback((authResponse) => {
    setAuthSession(authResponse);
    setIsLoggedInState(true);
    setUser({
      userId: authResponse?.userId || null,
      email: authResponse?.email || null,
      role: authResponse?.role || null,
      tenantId:
        authResponse?.tenantId ||
        authResponse?.tenants?.[0]?.tenantId ||
        null,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // No-op: logout is client-side token cleanup first
    } finally {
      clearAuthSession();
      setUser(null);
      setIsLoggedInState(false);
    }
  }, []);

  const syncCurrentUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setIsLoggedInState(false);
      setIsHydrating(false);
      return;
    }

    try {
      const me = await authService.getCurrentUser();
      if (me?.role !== CUSTOMER_ROLE) {
        clearAuthSession();
        setUser(null);
        setIsLoggedInState(false);

        const merchantAppUrl = import.meta.env.VITE_MERCHANT_APP_URL;
        if (merchantAppUrl) {
          window.location.href = merchantAppUrl;
        }
        return;
      }

      setUser(me);
      setIsLoggedInState(true);
    } catch {
      clearAuthSession();
      setUser(null);
      setIsLoggedInState(false);
    } finally {
      setIsHydrating(false);
    }
  }, []);

  useEffect(() => {
    syncCurrentUser();
  }, [syncCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        showModal,
        setShowModal,
        isLoggedIn,
        setIsLoggedIn,
        isHydrating,
        user,
        role: user?.role || null,
        applyAuthResponse,
        syncCurrentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
