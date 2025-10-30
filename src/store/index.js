import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import postReducer from './postSlice';
import adminReducer from './adminSlice';
import categoryReducer from './categorySlice';
import tagReducer from './tagSlice';
import commentReducer from './commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    admin: adminReducer,
    categories: categoryReducer,
    tags: tagReducer,
    comments: commentReducer,
  },
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

