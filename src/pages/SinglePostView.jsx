import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getPostById,
  likePost,
  deletePost,
  getRelatedPosts,
  incrementView,
} from '../store/postSlice';
import { addComment, getCommentsByPost, clearComments } from '../store/commentSlice';
import { bookmarkPost, getBookmarks } from '../store/authSlice';
import { Heart, Eye, MessageCircle, Bookmark, Edit, Trash2 } from 'lucide-react';
import BlogLayout from '../Layout/BlogLayout';

const SinglePostView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, relatedPosts, loading } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const { user, bookmarks, isAuthenticated } = useSelector((state) => state.auth);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    dispatch(getPostById(id));
    dispatch(getCommentsByPost(id));
    dispatch(incrementView(id));
    dispatch(getRelatedPosts(id));

    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getBookmarks());
    }
  }, [dispatch, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }
    await dispatch(likePost(id));
    await dispatch(getPostById(id));
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark posts');
      return;
    }
    await dispatch(bookmarkPost(id));
    await dispatch(getBookmarks());
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    await dispatch(addComment({ postId: id, content: commentText }));
    setCommentText('');
    await dispatch(getCommentsByPost(id));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await dispatch(deletePost(id));
      navigate('/');
    }
  };

  const isBookmarked = () => {
    return bookmarks.some((bookmark) => bookmark._id === id);
  };

  const isLiked = () => {
    return currentPost?.likes?.includes(user?._id);
  };

  const canEdit = () => {
    return (
      isAuthenticated &&
      (user?.role === 'Admin' || currentPost?.author?._id === user?._id)
    );
  };

  if (loading) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (!currentPost) {
    return (
      <BlogLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-600 text-lg">Post not found.</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto">
        {/* Main Post */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {currentPost.avatar?.secure_url && (
            <div className="h-96 bg-gray-200">
              <img
                src={currentPost.avatar.secure_url}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Additional Media */}
          {currentPost.media && currentPost.media.length > 0 && (
            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
              {currentPost.media.map((media, index) => (
                <img
                  key={index}
                  src={media.secure_url}
                  alt={`Media ${index}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Post Content */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentPost.title}</h1>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentPost.categories?.map((category) => (
              
                <span
                  key={category._id}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {category.name}
                  
                </span>
              ))}
              {currentPost.tags?.map((tag) => (
                <span
                  key={tag._id}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  #{tag.name}
                </span>
              ))}
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <Link
                to={`/user/${currentPost.author?._id}`}
                className="flex items-center gap-3 hover:text-gray-700"
              >
                {currentPost.author?.avatar?.secure_url ? (
                  <img
                    src={currentPost.author.avatar.secure_url}
                    alt={currentPost.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                )}
                <div>
                  <p className="font-semibold">{currentPost.author?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(currentPost.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>

              {canEdit() && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/posts/${id}/edit`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${isLiked() ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                  <Heart size={20} fill={isLiked() ? 'currentColor' : 'none'} />
                  <span>{currentPost.likes?.length || 0}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye size={20} />
                  <span>{currentPost.views || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageCircle size={20} />
                  <span>{comments.length}</span>
                </div>
              </div>
              <button
                onClick={handleBookmark}
                className={`${isBookmarked() ? 'text-yellow-500' : 'text-gray-500'} hover:text-yellow-500`}
              >
                <Bookmark size={20} fill={isBookmarked() ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </article>

        {/* Edit Post Link */}
        {canEdit() && (
          <div style={{ marginTop: 12 }}>
            <Link to={`/posts/${currentPost._id || currentPost.id}/edit`} className="text-blue-600 hover:underline">
              Edit Post
            </Link>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-3"
                required
              />
              <button
                type="submit"
                className="bg-black text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <p className="text-gray-600 mb-8">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>{' '}
              to post a comment
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-start gap-3">
                  {comment.user?.avatar?.secure_url ? (
                    <img
                      src={comment.user.avatar.secure_url}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.user?.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/post/${post._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="h-40 bg-gray-200">
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
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye size={16} />
                      <span>{post.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </BlogLayout>
  );
};

export default SinglePostView;

