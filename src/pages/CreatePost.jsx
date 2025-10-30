import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../store/postSlice';
import { getAllCategories, getAllTags } from '../store/categorySlice';
import { Image as ImageIcon, X } from 'lucide-react';
import BlogLayout from '../Layout/BlogLayout';

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);
  const { tags } = useSelector((state) => state.tags);
  const { loading } = useSelector((state) => state.posts);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    avatar: null,
    media: [],
    categories: [],
    tags: [],
    isPublished: true,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(getAllCategories());
    dispatch(getAllTags());
  }, [dispatch, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    
    if (field === 'avatar') {
      const file = files[0];
      setFormData({ ...formData, avatar: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (field === 'media') {
      setFormData({ ...formData, media: files });
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => setMediaPreviews((prev) => [...prev, reader.result]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index),
    });
  };

  const handleCategoryChange = (categoryId, checked) => {
    setFormData({
      ...formData,
      categories: checked
        ? [...formData.categories, categoryId]
        : formData.categories.filter((id) => id !== categoryId),
    });
  };

  const handleTagChange = (tagId, checked) => {
    setFormData({
      ...formData,
      tags: checked
        ? [...formData.tags, tagId]
        : formData.tags.filter((id) => id !== tagId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      categories: formData.categories.join(','),
      tags: formData.tags.join(','),
    };
    
    const result = await dispatch(createPost(submitData));
    if (createPost.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Write your post content..."
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <ImageIcon size={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'avatar')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Media
            </label>
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 inline-block">
              <ImageIcon size={20} />
              <span>Upload Media</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => handleFileChange(e, 'media')}
                className="hidden"
              />
            </label>
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category._id)}
                    onChange={(e) => handleCategoryChange(category._id, e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tags.map((tag) => (
                <label key={tag._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag._id)}
                    onChange={(e) => handleTagChange(tag._id, e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label className="text-sm font-medium text-gray-700">Publish immediately</label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </BlogLayout>
  );
};

export default CreatePost;

