import {
  cloudinaryConfig
} from '../config/cloudinary';

/**
 * Get the base URL for the backend server (without /api path)
 */
export const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  // Remove /api from the end if present
  return apiUrl.replace(/\/api\/?$/, '');
};

/**
 * Constructs the full image URL from a relative or absolute path
 * @param {string} imagePath - The image path from the backend
 * @returns {string} - The full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If it's already a full URL (http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const baseUrl = getServerBaseUrl();

  // Ensure the path starts with a slash
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${path}`;
};

/**
 * Get the first image from a product's images array or single image field
 * @param {Object} product - The product object
 * @returns {string} - The image URL
 */
export const getProductImageUrl = (product) => {
  if (!product) return '';

  // Handle array of images
  if (Array.isArray(product.images) && product.images.length > 0) {
    return getImageUrl(product.images[0]);
  }

  // Handle single image field
  if (product.image) {
    return getImageUrl(product.image);

  }

  return '';
};

/**
 * NOTE: Image uploads are now handled by the backend API.
 * Use the /api/cloudinary endpoints instead of uploading directly from the frontend.
 * This provides better security as API keys are kept on the server.
 */

/**
 * Generate Cloudinary transformation URL
 * @param {string} publicId - The Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getCloudinaryTransformUrl = (publicId, transformations = {}) => {
  if (!cloudinaryConfig.cloudName) {
    return '';
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = transformations;

  let transformString = `q_${quality},f_${format}`;

  if (width) transformString += `,w_${width}`;
  if (height) transformString += `,h_${height}`;
  if (width || height) transformString += `,c_${crop}`;
  if (gravity && crop === 'fill') transformString += `,g_${gravity}`;

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`;
};
