// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sokoni_access_token',
  REFRESH_TOKEN: 'sokoni_refresh_token',
  USER: 'sokoni_user',
  LANGUAGE: 'sokoni_language',
  THEME: 'sokoni_theme',
  FCM_TOKEN: 'sokoni_fcm_token',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_KYC: '/users/kyc',
    GET_KYC: '/users/kyc',
    SETTINGS: '/users/settings',
  },
  // Products
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    GET: (id) => `/products/${id}`,
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    GET: (id) => `/orders/${id}`,
    UPDATE: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    HISTORY: '/orders/history',
  },
  // Messages
  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    GET_CONVERSATION: (id) => `/messages/conversations/${id}`,
    SEND: '/messages/send',
    MARK_READ: (id) => `/messages/${id}/read`,
  },
  // Deliveries
  DELIVERIES: {
    LIST: '/deliveries',
    GET: (id) => `/deliveries/${id}`,
    TRACK: (id) => `/deliveries/${id}/track`,
    UPDATE_STATUS: (id) => `/deliveries/${id}/status`,
  },
  // Warehouses
  WAREHOUSES: {
    LIST: '/warehouses',
    GET: (id) => `/warehouses/${id}`,
    INVENTORY: (id) => `/warehouses/${id}/inventory`,
    UPDATE_STOCK: (id) => `/warehouses/${id}/stock`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    PREFERENCES: '/notifications/preferences',
    REGISTER_FCM: '/notifications/fcm-token',
  },
  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    MULTIPLE: '/upload/multiple',
  },
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  RETAILER: 'retailer',
  WHOLESALER: 'wholesaler',
  ADMIN: 'admin',
  DELIVERY: 'delivery',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Delivery Status
export const DELIVERY_STATUS = {
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
};

// Product Categories (placeholder - will be fetched from API)
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports & Outdoors',
  'Food & Beverages',
  'Health & Beauty',
  'Books & Stationery',
  'Automotive',
  'Toys & Games',
  'Others',
];

// Languages
export const LANGUAGES = {
  EN: 'en',
  SW: 'sw',
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Toast Notification Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Responsive Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  XS: 475,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};
