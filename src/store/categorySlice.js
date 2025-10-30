import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Async thunks
export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/category/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const getCategoryById = createAsyncThunk(
  'categories/getById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/category/get/${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/createcategory', { name, description });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, name, description }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/updatecategory/${id}`, {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/deletecategory/${categoryId}`);
      return { categoryId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Categories
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Category By ID
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.currentCategory = action.payload.data;
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.data);
        toast.success('Category created successfully!');
      })
      .addCase(createCategory.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload.data._id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
        toast.success('Category updated successfully!');
      })
      .addCase(updateCategory.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload.categoryId);
        toast.success('Category deleted successfully!');
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;

