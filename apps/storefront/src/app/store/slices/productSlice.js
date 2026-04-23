import { createSlice } from '@reduxjs/toolkit';

// productSlice chỉ còn quản lý UI state
// Server state (products, categories) đã chuyển sang TanStack Query trong ProductContext
const initialState = {
  selectedProduct: null,
  quickAddProduct: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    setQuickAddProduct(state, action) {
      state.quickAddProduct = action.payload;
    },
  },
});

export const { setSelectedProduct, setQuickAddProduct } = productSlice.actions;

export default productSlice.reducer;
