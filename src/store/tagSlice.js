import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Async thunks
export const getAllTags = createAsyncThunk(
  'tags/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/tag/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tags');
    }
  }
);

export const getTagById = createAsyncThunk(
  'tags/getById',
  async (tagId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tag/${tagId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tag');
    }
  }
);

export const createTag = createAsyncThunk(
  'tags/create',
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/admin/createtag', { name, description });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create tag');
    }
  }
);

export const updateTag = createAsyncThunk(
  'tags/update',
  async ({ id, name, description }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/updatetag/${id}`, {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tag');
    }
  }
);

export const deleteTag = createAsyncThunk(
  'tags/delete',
  async (tagId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/deletetag/${tagId}`);
      return { tagId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tag');
    }
  }
);

const tagSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: [],
    currentTag: null,
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
      // Get All Tags
      .addCase(getAllTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data;
      })
      .addCase(getAllTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Tag By ID
      .addCase(getTagById.fulfilled, (state, action) => {
        state.currentTag = action.payload.data;
      })
      // Create Tag
      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload.data);
        toast.success('Tag created successfully!');
      })
      .addCase(createTag.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Update Tag
      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex((t) => t._id === action.payload.data._id);
        if (index !== -1) {
          state.tags[index] = action.payload.data;
        }
        toast.success('Tag updated successfully!');
      })
      .addCase(updateTag.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Delete Tag
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter((t) => t._id !== action.payload.tagId);
        toast.success('Tag deleted successfully!');
      })
      .addCase(deleteTag.rejected, (state, action) => {
        toast.error(action.payload);
      });
  },
});

export const { clearError } = tagSlice.actions;
export default tagSlice.reducer;

