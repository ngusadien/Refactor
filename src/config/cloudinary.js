/**
 * Cloudinary Configuration
 *
 * To use Cloudinary, you need to:
 * 1. Create a free account at https://cloudinary.com
 * 2. Get your cloud name from the dashboard
 * 3. Enable unsigned uploads:
 *    - Go to Settings > Upload
 *    - Scroll to "Upload presets"
 *    - Click "Add upload preset"
 *    - Set "Signing Mode" to "Unsigned"
 *    - Set a preset name (e.g., "sokoni_uploads")
 *    - Configure folder (e.g., "sokoni/products")
 *    - Save the preset
 * 4. Add your credentials to .env file:
 *    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
 */

export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '', // Optional, only needed for signed uploads
};

/**
 * Check if Cloudinary is configured
 */
export const isCloudinaryConfigured = () => {
  return !!(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);
};

/**
 * Get Cloudinary upload URL
 */
export const getCloudinaryUploadUrl = () => {
  return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
};

/**
 * Default upload options
 */
export const defaultUploadOptions = {
  folder: 'sokoni/products',
  resource_type: 'image',
  allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
  max_file_size: 5242880, // 5MB in bytes
};
