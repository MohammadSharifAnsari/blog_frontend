import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  PlusSquare,
  User,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  FolderOpen,
  Hash,
  Bookmark,
} from 'lucide-react';
import { logoutUser } from '../store/authSlice';

const BlogLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Create Post', icon: PlusSquare, path: '/create-post' },
    { name: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
  ];

  const adminNavigation = user?.role === 'Admin' ? [
    { name: 'Dashboard', icon: Settings, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Categories', icon: FolderOpen, path: '/admin/categories' },
    { name: 'Tags', icon: Hash, path: '/admin/tags' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black text-white"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white">BlogApp</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}

            {adminNavigation.length > 0 && (
              <>
                <div className="border-t border-gray-800 my-4"></div>
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase">
                  Admin
                </h3>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-800 p-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800"
                  onClick={() => setSidebarOpen(false)}
                >
                  <User size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 text-left"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-2 text-center bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-2 text-center border border-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default BlogLayout;

