import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllPosts, searchPosts } from '../store/postSlice.js';
import { Heart, Eye, MessageCircle, Bookmark, Search, ChevronDown, Check } from 'lucide-react';
import { likePost } from '../store/postSlice.js';
import { getBookmarks, bookmarkPost } from '../store/authSlice';
import { getAllCategories } from '../store/categorySlice';
import { getAllTags } from '../store/tagSlice';
import BlogLayout from '../Layout/BlogLayout';

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    posts: postsState,
    loading = false,
    pagination: paginationState,
  } = useSelector((state) => state.posts || {});
  const posts = Array.isArray(postsState) ? postsState : [];
  const pagination = paginationState || { currentPage: 1, totalPages: 1, totalPosts: 0 };
  const { user, bookmarks, isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { categories: categoriesState } = useSelector((state) => state.categories || {});
  const { tags: tagsState } = useSelector((state) => state.tags || {});
  const categories = Array.isArray(categoriesState) ? categoriesState : [];
  const tags = Array.isArray(tagsState) ? tagsState : [];
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openCat, setOpenCat] = useState(false);
  const [openTag, setOpenTag] = useState(false);

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllTags());
    if (searchQuery && searchQuery.trim().length > 0) {
      dispatch(searchPosts({
        search: searchQuery.trim(),
        page,
        limit: 9,
        category: selectedCategories.join(','),
        tag: selectedTags.join(',')
      }));
    } else {
      dispatch(getAllPosts({ page, limit: 9 }));
    }
  }, [dispatch, page]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getBookmarks());
    }
  }, [dispatch, isAuthenticated]);

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }
    await dispatch(likePost(postId));
    if (searchQuery && searchQuery.trim().length > 0) {
      await dispatch(searchPosts({
        search: searchQuery.trim(), page, limit: 9,
        category: selectedCategories.join(','), tag: selectedTags.join(',')
      }));
    } else {
      await dispatch(getAllPosts({ page, limit: 9 }));
    }
  };

  const handleBookmark = async (postId) => {
    if (!isAuthenticated) {
      alert('Please login to bookmark posts');
      return;
    }
    await dispatch(bookmarkPost(postId));
    await dispatch(getBookmarks());
  };

  // Debounced search on query change
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length > 0) {
        setPage(1);
        dispatch(searchPosts({
          search: searchQuery.trim(), page: 1, limit: 9,
          category: selectedCategories.join(','), tag: selectedTags.join(',')
        }));
      } else {
        setPage(1);
        dispatch(getAllPosts({ page: 1, limit: 9 }));
      }
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategories, selectedTags, dispatch]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isBookmarked = (postId) => {
    return bookmarks.some((bookmark) => bookmark._id === postId);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

    return (
   <BlogLayout>
      <div className="max-w-6xl mx-auto">
        {/* Search Bar + Filters */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {/* Category dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenCat((o) => !o)}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Categories ({selectedCategories.length})
                <ChevronDown size={16} />
              </button>
              {openCat && (
                <div className="absolute z-10 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-64 overflow-auto">
                  {categories.map((c) => (
                    <label key={c._id} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c._id)}
                        onChange={() => toggleCategory(c._id)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm text-gray-800">{c.name}</span>
                      {selectedCategories.includes(c._id) && <Check size={14} className="ml-auto text-green-600" />}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tag dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenTag((o) => !o)}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Tags ({selectedTags.length})
                <ChevronDown size={16} />
              </button>
              {openTag && (
                <div className="absolute z-10 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg p-2 max-h-64 overflow-auto">
                  {tags.map((t) => (
                    <label key={t._id} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(t._id)}
                        onChange={() => toggleTag(t._id)}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm text-gray-800">{t.name}</span>
                      {selectedTags.includes(t._id) && <Check size={14} className="ml-auto text-green-600" />}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
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
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 ${post.likes?.includes(user?._id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                      >
                        <Heart size={18} fill={post.likes?.includes(user?._id) ? 'currentColor' : 'none'} />
                        <span>{post.likes?.length || 0}</span>
                      </button>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye size={18} />
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MessageCircle size={18} />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookmark(post._id)}
                      className={`${isBookmarked(post._id) ? 'text-yellow-500' : 'text-gray-500'} hover:text-yellow-500`}
                    >
                      <Bookmark size={18} fill={isBookmarked(post._id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && (pagination?.totalPages || 0) > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </BlogLayout> 
    );
};

export default HomePage;
