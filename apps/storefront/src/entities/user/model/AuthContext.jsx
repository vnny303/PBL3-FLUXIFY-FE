//Bộ nhớ đăng nhập toàn cục của app

import React, { 
  useCallback, 
  useEffect, 
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearAuthSession,
  getToken,
  setAuthSession,
} from '@fluxify/shared/lib';

import { authService } from '../../../shared/api/authService';
import {
  clearUser,
  setIsHydrating as setIsHydratingAction,
  setIsLoggedIn as setIsLoggedInAction,
  setShowModal as setShowModalAction,
  setUser as setUserAction,
} from '../../../app/store/slices/authSlice';
import { AuthContext } from './authContext';

const CUSTOMER_ROLE = 'customer';

const mapAuthResponseToUser = (authResponse) => ({
  userId: authResponse?.userId || null,
  email: authResponse?.email || null,
  role: authResponse?.role || null,
  tenantId:
    authResponse?.tenantId ||
    authResponse?.tenants?.[0]?.tenantId ||
    null,
});

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { showModal, isLoggedIn, isHydrating, user } = useSelector(
    (state) => state.auth
  );

  const setShowModal = useCallback(
    (value) => {
      dispatch(setShowModalAction(value));
    },
    [dispatch]
  );

  const setIsLoggedIn = useCallback((value) => {
    const nextValue = Boolean(value);
    dispatch(setIsLoggedInAction(nextValue));
    if (!nextValue) {
      clearAuthSession();
      dispatch(clearUser());
    }
  }, [dispatch]);

  const applyAuthResponse = useCallback((authResponse) => {
    setAuthSession(authResponse);
    dispatch(setIsLoggedInAction(true));
    dispatch(setUserAction(mapAuthResponseToUser(authResponse)));
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // No-op: logout is client-side token cleanup first
    } finally {
      clearAuthSession();
      dispatch(clearUser());
    }
  }, [dispatch]);

  //Khôi phục phiên đăng nhập khi app mở hoặc reload
  const syncCurrentUser = useCallback(
    async () => {
      //TH1: Khong co token
      if (!getToken()) {
        dispatch(clearUser());
        return;
      }

      //TH2: Co token
      try {
        const me = await authService.getCurrentUser();
        if (me?.role !== CUSTOMER_ROLE) {
          clearAuthSession();
          dispatch(clearUser());

          //TH4: role không phải customer
          const merchantAppUrl = import.meta.env.VITE_MERCHANT_APP_URL;
          if (merchantAppUrl) {
            window.location.href = merchantAppUrl;
          }
          return;
        }

        dispatch(setUserAction(me));
        dispatch(setIsLoggedInAction(true));
        } catch {
        clearAuthSession();
        dispatch(clearUser());
      } finally {
        dispatch(setIsHydratingAction(false));
      }
   }, [dispatch]);

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
