import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

// Async thunks
export const createPost = createAsyncThunk(
  "posts/create",
  async (postData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      if (postData.avatar) formData.append("avatar", postData.avatar);
      if (postData.media) {
        postData.media.forEach((file) => formData.append("media", file));
      }
      if (postData.categories)
        formData.append("categories", postData.categories);
      if (postData.tags) formData.append("tags", postData.tags);
      if (postData.isPublished !== undefined)
        formData.append("isPublished", postData.isPublished);

      const response = await axiosInstance.post("/post/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post"
      );
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/getAll",
  async (
    { page = 1, limit = 10, category, published },
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit };
      if (category) params.category = category;
      if (published !== undefined) params.published = published;

      const response = await axiosInstance.get("/post/all", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/post/getpost/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (postData.title) formData.append("title", postData.title);
      if (postData.content) formData.append("content", postData.content);
      if (postData.avatar) formData.append("avatar", postData.avatar);
      if (postData.media) {
        postData.media.forEach((file) => formData.append("media", file));
      }
      if (postData.categories)
        formData.append("categories", postData.categories);
      if (postData.tags) formData.append("tags", postData.tags);
      if (postData.isPublished !== undefined)
        formData.append("isPublished", postData.isPublished);

      const response = await axiosInstance.put(`/post/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/post/${postId}`);
      return { postId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/like",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/${postId}/like`);
      return { postId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like post"
      );
    }
  }
);

export const getRelatedPosts = createAsyncThunk(
  "posts/getRelated",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/post/related/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch related posts"
      );
    }
  }
);

export const incrementView = createAsyncThunk(
  "posts/incrementView",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/post/${postId}/views`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to increment view"
      );
    }
  }
);

export const searchPosts = createAsyncThunk(
  "posts/search",
  async (
    { search, tag, category, page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const params = { search, page, limit };
      if (tag) params.tag = tag;
      if (category) params.category = category;

      const response = await axiosInstance.get("/post/filtersearch", {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search posts"
      );
    }
  }
);

// Removed duplicate bookmark thunk; use authSlice.bookmarkPost instead

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentPost: null,
    relatedPosts: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.post);
        toast.success("Post created successfully!");
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalPosts: action.payload.totalPosts,
        };
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Post By ID
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload.post;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload.post._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload.post;
        }
        toast.success("Post updated successfully!");
      })
      .addCase(updatePost.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (p) => p._id !== action.payload.postId
        );
        toast.success("Post deleted successfully!");
      })
      .addCase(deletePost.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        toast.success(action.payload.data.message);
      })
      .addCase(likePost.rejected, (state, action) => {
        toast.error(action.payload);
      })
      // Get Related Posts
      .addCase(getRelatedPosts.fulfilled, (state, action) => {
        state.relatedPosts = action.payload.data;
      })
      // Search Posts
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;
