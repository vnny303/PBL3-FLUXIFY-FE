import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showCart: false,
  showAddToCartPopup: false,
  cartItems: [],
  lastAddedItem: null,
  isLoadingCart: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setShowCart(state, action) {
      state.showCart = Boolean(action.payload);
    },
    setShowAddToCartPopup(state, action) {
      state.showAddToCartPopup = Boolean(action.payload);
    },
    setCartItems(state, action) {
      state.cartItems = Array.isArray(action.payload) ? action.payload : [];
    },
    setLastAddedItem(state, action) {
      state.lastAddedItem = action.payload;
    },
    setIsLoadingCart(state, action) {
      state.isLoadingCart = Boolean(action.payload);
    },
    clearCartState(state) {
      state.cartItems = [];
      state.lastAddedItem = null;
      state.isLoadingCart = false;
      state.showAddToCartPopup = false;
    },
  },
});

export const {
  setShowCart,
  setShowAddToCartPopup,
  setCartItems,
  setLastAddedItem,
  setIsLoadingCart,
  clearCartState,
} = cartSlice.actions;

export default cartSlice.reducer;
