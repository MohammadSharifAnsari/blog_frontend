import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../store/adminSlice';
import { getAllPosts } from '../../store/postSlice';
import { getAllComments } from '../../store/adminSlice';
import { Users, FileText, MessageCircle } from 'lucide-react';
import BlogLayout from '../../Layout/BlogLayout';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.admin);
  const { posts } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllPosts({ page: 1, limit: 100 }));
    dispatch(getAllComments());
  }, [dispatch]);

  return (
    <BlogLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-full p-4">
                <FileText className="text-green-600" size={32} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-full p-4">
                <MessageCircle className="text-purple-600" size={32} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Comments</p>
                <p className="text-3xl font-bold text-gray-900">{comments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div key={user._id} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0">
                  {user.avatar?.secure_url ? (
                    <img
                      src={user.avatar.secure_url}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h2>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post._id} className="pb-3 border-b border-gray-200 last:border-0">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{post.author?.name}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default AdminDashboard;

