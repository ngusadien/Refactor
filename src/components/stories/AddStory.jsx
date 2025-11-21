import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { createStory } from '../../features/storySlice';
import api from '../../services/api';

const AddStory = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [formData, setFormData] = useState({
    mediaFile: null,
    mediaPreview: null,
    mediaType: 'image',
    caption: '',
    productId: '',
    duration: 5000,
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Please select an image or video file');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        mediaFile: file,
        mediaPreview: reader.result,
        mediaType: isVideo ? 'video' : 'image',
        duration: isVideo ? 15000 : 5000,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mediaFile) {
      alert('Please select a media file');
      return;
    }

    setLoading(true);

    try {
      // Create FormData with both file and story details
      const submitFormData = new FormData();
      submitFormData.append('file', formData.mediaFile);
      submitFormData.append('caption', formData.caption);
      submitFormData.append('duration', formData.duration);

      if (formData.productId) {
        submitFormData.append('product', formData.productId);
        submitFormData.append('ctaButton', JSON.stringify({
          text: 'View Product',
          link: `/products/${formData.productId}`,
        }));
      }

      // Submit to stories endpoint with file and data together
      const response = await api.post('/stories', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      // Reset form and close
      setFormData({
        mediaFile: null,
        mediaPreview: null,
        mediaType: 'image',
        caption: '',
        productId: '',
        duration: 5000,
      });

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating story:', error);
      alert(error.response?.data?.message || error.message || 'Failed to create story');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="card bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Story</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* File upload area */}
          {!formData.mediaPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-gray-600 font-medium mb-2">Click to upload image or video</p>
              <p className="text-sm text-gray-500">Max size: 50MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              {/* Preview */}
              <div className="aspect-9/16 bg-gray-100 rounded-lg overflow-hidden mb-4">
                {formData.mediaType === 'image' ? (
                  <img
                    src={formData.mediaPreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={formData.mediaPreview}
                    className="w-full h-full object-contain"
                    controls
                  />
                )}
              </div>

              {/* Change file button */}
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    mediaFile: null,
                    mediaPreview: null,
                  });
                }}
                className="btn-outline w-full mb-4"
              >
                Change File
              </button>
            </div>
          )}

          {/* Caption input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption (Optional)
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Add a caption..."
              maxLength={500}
              rows={3}
              className="input-field w-full resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.caption.length}/500
            </p>
          </div>

          {/* Product selection (optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link to Product (Optional)
            </label>
            <select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="input-field w-full"
            >
              <option value="">No product</option>
              {products?.items?.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title} - KSh {product.price?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Duration (for images) */}
          {formData.mediaType === 'image' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Duration: {formData.duration / 1000}s
              </label>
              <input
                type="range"
                min="3000"
                max="10000"
                step="1000"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3s</span>
                <span>10s</span>
              </div>
            </div>
          )}

          {/* Upload progress */}
          {loading && uploadProgress > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading || !formData.mediaFile}
            >
              {loading ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddStory.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default AddStory;
