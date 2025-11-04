import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BlogLayout from '../Layout/BlogLayout';
import { getAllCategories } from '../store/categorySlice';
import { getAllTags } from '../store/tagSlice';
import { getPostById, updatePost } from '../store/postSlice';
import { Image as ImageIcon, X } from 'lucide-react';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories: categoriesState } = useSelector((state) => state.categories || {});
  const { tags: tagsState } = useSelector((state) => state.tags || {});
  const categories = Array.isArray(categoriesState) ? categoriesState : [];
  const tags = Array.isArray(tagsState) ? tagsState : [];
  const { currentPost, loading } = useSelector((state) => state.posts || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(getAllCategories());
    dispatch(getAllTags());
    dispatch(getPostById(id));
  }, [dispatch, isAuthenticated, navigate, id]);

  useEffect(() => {
    if (currentPost?._id === id) {
      setFormData({
        title: currentPost.title || '',
        content: currentPost.content || '',
        avatar: null,
        media: [],
        categories: (currentPost.categories || []).map((c) => c._id || c),
        tags: (currentPost.tags || []).map((t) => t._id || t),
        isPublished: currentPost.isPublished ?? true,
      });
      setAvatarPreview(currentPost.avatar?.secure_url || null);
      setMediaPreviews((currentPost.media || []).map((m) => m.secure_url));
    }
  }, [currentPost, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (field === 'avatar') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (field === 'media') {
      setFormData((prev) => ({ ...prev, media: files }));
      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) setMediaPreviews((prev) => [...prev, ...previews]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index) => {
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const handleTagChange = (tagId, checked) => {
    setFormData((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, tagId]
        : prev.tags.filter((id) => id !== tagId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const submitData = {
        title: formData.title,
        content: formData.content,
        isPublished: formData.isPublished,
        categories: formData.categories.join(','),
        tags: formData.tags.join(','),
      };
      if (formData.avatar) submitData.avatar = formData.avatar;
      if (formData.media?.length) submitData.media = formData.media;

      const result = await dispatch(updatePost({ id, postData: submitData }));
      if (updatePost.fulfilled.match(result)) {
        navigate(`/post/${id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentPost && loading) return <div>Loading post...</div>;
  return (
    <BlogLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Media</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <label className="text-sm font-medium text-gray-700">Published</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-black text-black py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </BlogLayout>
  );
}