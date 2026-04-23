import { createSlice } from '@reduxjs/toolkit';
import { getAuthSession, getToken } from '@fluxify/shared/lib';

const snapshot = getAuthSession();
const initialUser = snapshot?.userId
  ? {
      userId: snapshot.userId,
      email: snapshot.email,
      role: snapshot.role,
      tenantId: snapshot.tenantId,
    }
  : null;

const initialState = {
  showModal: false,
  isLoggedIn: Boolean(getToken()),
  isHydrating: true,
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setShowModal(state, action) {
      state.showModal = Boolean(action.payload);
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = Boolean(action.payload);
    },
    setIsHydrating(state, action) {
      state.isHydrating = Boolean(action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isHydrating = false;
    },
  },
});

export const {
  setShowModal,
  setIsLoggedIn,
  setIsHydrating,
  setUser,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;
