import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { clearAuthSession, getAuthSession, getToken, setAuthSession } from '@fluxify/shared/lib';
import { authService } from '../../shared/api/authService';

const MERCHANT_ROLE = 'merchant';
const AuthContext = createContext(null);

export function MerchantAuthProvider({ children }) {
  const [isHydrating, setIsHydrating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const [user, setUser] = useState(() => {
    const session = getAuthSession();
    if (!session.userId) {
      return null;
    }

    return {
      userId: session.userId,
      email: session.email,
      role: session.role,
      tenantId: session.tenantId,
    };
  });

  const syncCurrentUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setIsLoggedIn(false);
      setIsHydrating(false);
      return;
    }

    try {
      const me = await authService.getCurrentUser();

      if (me?.role !== MERCHANT_ROLE) {
        clearAuthSession();
        setUser(null);
        setIsLoggedIn(false);

        const storefrontAppUrl = import.meta.env.VITE_STOREFRONT_APP_URL;
        if (storefrontAppUrl) {
          window.location.href = storefrontAppUrl;
        }
        return;
      }

      setUser(me);
      setIsLoggedIn(true);
    } catch {
      clearAuthSession();
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsHydrating(false);
    }
  }, []);

  useEffect(() => {
    syncCurrentUser();
  }, [syncCurrentUser]);

  const login = useCallback(async ({ email, password }) => {
    const response = await authService.loginMerchant({ email, password });

    if (response?.role !== MERCHANT_ROLE) {
      throw new Error('Tài khoản không có quyền merchant.');
    }

    setAuthSession(response);
    setIsLoggedIn(true);

    const me = await authService.getCurrentUser();
    setUser(me);

    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // No-op: server-side logout is stateless for JWT
    } finally {
      clearAuthSession();
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isHydrating,
        isLoggedIn,
        user,
        role: user?.role || null,
        login,
        logout,
        syncCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMerchantAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useMerchantAuth must be used within MerchantAuthProvider');
  }
  return context;
}
