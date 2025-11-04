import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import postReducer from './postSlice.js';
import categoryReducer from './categorySlice.js';
import tagReducer from './tagSlice.js';
import commentReducer from './commentSlice.js';
import adminReducer from './adminSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        categories: categoryReducer,
        tags: tagReducer,
        comments: commentReducer,
        admin: adminReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;