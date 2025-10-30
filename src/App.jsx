import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from './store/authSlice';

// Public pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';

// Protected pages
import CreatePost from './pages/CreatePost';
import SinglePostView from './pages/SinglePostView';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTags from './pages/admin/AdminTags';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Try to get user profile on app load
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Main Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<SinglePostView />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/bookmarks" element={<Bookmarks />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/tags" element={<AdminTags />} />
    </Routes>
  );
}

export default App;
