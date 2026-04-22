import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productService } from '../../../../shared/api/productService';

const buildInventoryErrorMessage = ({ categoryFailed, productFailed }) => {
  if (categoryFailed && productFailed) {
    return 'Không thể tải danh mục và sản phẩm';
  }

  if (categoryFailed) {
    return 'Không thể tải danh mục';
  }

  if (productFailed) {
    return 'Không thể tải sản phẩm';
  }

  return null;
};

const initialState = {
  selectedProduct: null,
  quickAddProduct: null,
  products: [],
  categories: [],
  isLoadingInventory: false,
  inventoryError: null,
};

export const fetchInventory = createAsyncThunk(
  'product/fetchInventory',
  async (tenantId, { rejectWithValue }) => {
    if (!tenantId) {
      return {
        categories: [],
        products: [],
        inventoryError: null,
      };
    }

    try {
      const [categoriesRes, productsRes] = await Promise.allSettled([
        productService.getCategories(tenantId),
        productService.getProducts(tenantId),
      ]);

      const categoryFailed = categoriesRes.status !== 'fulfilled';
      const productFailed = productsRes.status !== 'fulfilled';
      const inventoryError = buildInventoryErrorMessage({
        categoryFailed,
        productFailed,
      });

      const categories = categoryFailed ? [] : categoriesRes.value || [];
      const products = productFailed ? [] : productsRes.value || [];

      if (categoryFailed && productFailed) {
        return rejectWithValue(inventoryError);
      }

      return {
        categories,
        products,
        inventoryError,
      };
    } catch {
      return rejectWithValue('Không thể tải dữ liệu cửa hàng');
    }
  }
);

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
    resetInventory(state) {
      state.products = [];
      state.categories = [];
      state.inventoryError = null;
      state.isLoadingInventory = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoadingInventory = true;
        state.inventoryError = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoadingInventory = false;
        state.categories = action.payload.categories;
        state.products = action.payload.products;
        state.inventoryError = action.payload.inventoryError;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoadingInventory = false;
        state.categories = [];
        state.products = [];
        state.inventoryError =
          action.payload || action.error?.message || 'Không thể tải dữ liệu cửa hàng';
      });
  },
});

export const { setSelectedProduct, setQuickAddProduct, resetInventory } =
  productSlice.actions;

export default productSlice.reducer;
