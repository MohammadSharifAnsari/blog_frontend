import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

// Async thunks
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/delete/${userId}`);
      return { userId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const getAllComments = createAsyncThunk(
  'admin/getAllComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/admin/allcomment');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);
export const resetPassword=createAsyncThunk("auth/reset-password",async(data)=>{

    try{

        const res=axiosInstance.post(`user/reset-password/${data[0]}`,data[1]);//data[0]=>token data[1]=newpasssword
        
        toast.promise(res,{
            loading:"reseting password...",
            success:(state)=>{
                return state?.data?.message;
            },
            error:"Failed to reset password"
        })
        return (await res).data;
        
    }
    catch(err){
        toast.error(err?.responce?.data?.message);
        
    }

})


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    currentUser: null,
    comments: [],
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
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User By ID
      .addCase(getUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload.data;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload.userId);
        toast.success('User deleted successfully!');
      })
      .addCase(deleteUser.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Get All Comments
      .addCase(getAllComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;

