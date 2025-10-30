import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
      }

      const response = await axiosInstance.post('/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/reset-password/${resetToken}`, {
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/changepassword', {
        oldpassword: oldPassword,
        newpassword: newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ id, fullName, avatar }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (fullName) formData.append('fullName', fullName);
      if (avatar) formData.append('avatar', avatar);

      const response = await axiosInstance.put(`/user/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const bookmarkPost = createAsyncThunk(
  'auth/bookmarkPost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/user/bookmark/${postId}`);
      return { postId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to bookmark');
    }
  }
);

export const getBookmarks = createAsyncThunk(
  'auth/getBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/user/getbookmarkpost');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookmarks');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    bookmarks: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        toast.success('Registration successful!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.bookmarks = [];
        toast.success('Logout successful!');
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      })
      // Forgot Password
      .addCase(forgotPassword.fulfilled, (state, action) => {
        toast.success('Reset email sent successfully!');
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Reset Password
      .addCase(resetPassword.fulfilled, () => {
        toast.success('Password reset successful!');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Change Password
      .addCase(changePassword.fulfilled, () => {
        toast.success('Password changed successfully!');
      })
      .addCase(changePassword.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        toast.success('Profile updated successfully!');
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Bookmark
      .addCase(bookmarkPost.fulfilled, (state, action) => {
        toast.success(action.payload.data.message);
      })
      .addCase(bookmarkPost.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Get Bookmarks
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload.bookmarks || [];
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

