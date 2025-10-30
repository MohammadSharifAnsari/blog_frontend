import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBookmarks } from '../store/authSlice';
import { Heart, Eye, MessageCircle, Bookmark } from 'lucide-react';
import BlogLayout from '../Layout/BlogLayout';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { user, bookmarks } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getBookmarks());
    }
  }, [dispatch, user]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-600 text-lg mb-4">Please login to view your bookmarks</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookmarks</h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg mb-4">You haven't bookmarked any posts yet</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
            >
              Browse Posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {/* Post Image */}
                <Link to={`/post/${post._id}`}>
                  <div className="h-48 bg-gray-200 relative">
                    {post.avatar?.secure_url ? (
                      <img
                        src={post.avatar.secure_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Post Content */}
                <div className="p-6">
                  <Link to={`/post/${post._id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-gray-700 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories?.slice(0, 2).map((category) => (
                      <span
                        key={category._id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '')}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <Link to={`/user/${post.author?._id}`} className="flex items-center gap-2 hover:text-black">
                      {post.author?.avatar?.secure_url ? (
                        <img
                          src={post.author.avatar.secure_url}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                      )}
                      <span>{post.author?.name}</span>
                    </Link>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Heart size={18} />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Eye size={18} />
                      <span>{post.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageCircle size={18} />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default Bookmarks;

