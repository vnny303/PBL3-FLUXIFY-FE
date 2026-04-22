import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addWishlistItem(state, action) {
      const item = action.payload;
      const exists = state.wishlistItems.some((wishlistItem) => wishlistItem.id === item.id);
      if (!exists) {
        state.wishlistItems.unshift(item);
      }
    },
    removeWishlistItem(state, action) {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter((item) => item.id !== productId);
    },
    clearWishlist(state) {
      state.wishlistItems = [];
    },
  },
});

export const { addWishlistItem, removeWishlistItem, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
