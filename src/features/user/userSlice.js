import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../constants';

// Async thunks
export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadKYC = createAsyncThunk(
  'user/uploadKYC',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.UPLOAD_KYC, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload KYC');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.USERS.SETTINGS, settings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const initialState = {
  profile: null,
  settings: {
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  kyc: {
    status: 'pending',
    documents: [],
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLanguage: (state, action) => {
      state.settings.language = action.payload;
    },
    setTheme: (state, action) => {
      state.settings.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        if (action.payload.settings) {
          state.settings = { ...state.settings, ...action.payload.settings };
        }
        if (action.payload.kyc) {
          state.kyc = action.payload.kyc;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      })
      // Upload KYC
      .addCase(uploadKYC.fulfilled, (state, action) => {
        state.kyc = action.payload;
      })
      // Update settings
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      });
  },
});

export const { clearError, setLanguage, setTheme } = userSlice.actions;
export default userSlice.reducer;
