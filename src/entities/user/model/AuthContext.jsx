import React, { createContext, useState, useContext, useEffect } from 'react';
import { STORAGE_KEYS } from '../../../shared/lib/constants';
import { authService } from '../../../shared/api/authService';

const AuthContext = createContext();

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [session, setSession] = useState(readStoredSession);

  const isLoggedIn = !!(session?.token || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));

  const login = (nextSession) => {
    const normalized = {
      token: nextSession.token,
      userId: nextSession.userId,
      email: nextSession.email,
      role: nextSession.role,
      tenantId: nextSession.tenantId,
      subdomain: nextSession.subdomain,
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, normalized.token || '');
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(normalized));
    if (normalized.tenantId) localStorage.setItem(STORAGE_KEYS.TENANT_ID, normalized.tenantId);
    if (normalized.userId) localStorage.setItem(STORAGE_KEYS.CUSTOMER_ID, normalized.userId);
    if (normalized.subdomain) localStorage.setItem(STORAGE_KEYS.SUBDOMAIN, normalized.subdomain);

    setSession(normalized);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    localStorage.removeItem(STORAGE_KEYS.TENANT_ID);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_ID);
    localStorage.removeItem(STORAGE_KEYS.SUBDOMAIN);
    setSession(null);
  };

  useEffect(() => {
    const syncCurrentUser = async () => {
      if (!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)) return;

      try {
        const me = await authService.getCurrentUser();
        setSession((prev) => ({
          ...prev,
          userId: me.userId || prev?.userId,
          email: me.email || prev?.email,
          role: me.role || prev?.role,
          tenantId: me.tenantId || prev?.tenantId,
        }));
      } catch {
        // Nếu /me lỗi (401), interceptor sẽ tự logout.
      }
    };

    syncCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{
      showModal,
      setShowModal,
      isLoggedIn,
      session,
      login,
      logout,
      setSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
