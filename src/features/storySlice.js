import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const initialState = {
  stories: [], // Array of grouped stories by user
  myStories: [], // Current user's stories
  currentStory: null,
  loading: false,
  error: null,
  viewedStories: [], // Track which stories have been viewed in current session
};

// Async thunks
export const fetchAllStories = createAsyncThunk(
  'stories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch stories'
      );
    }
  }
);

export const fetchMyStories = createAsyncThunk(
  'stories/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stories/my/stories');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch your stories'
      );
    }
  }
);

export const fetchUserStories = createAsyncThunk(
  'stories/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stories/user/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user stories'
      );
    }
  }
);

export const createStory = createAsyncThunk(
  'stories/create',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await api.post('/stories', storyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create story'
      );
    }
  }
);

export const viewStory = createAsyncThunk(
  'stories/view',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/stories/${storyId}/view`);
      return { storyId, viewCount: response.data.viewCount };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to record view'
      );
    }
  }
);

export const toggleLikeStory = createAsyncThunk(
  'stories/toggleLike',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/stories/${storyId}/like`);
      return {
        storyId,
        likeCount: response.data.likeCount,
        isLiked: response.data.isLiked,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like story'
      );
    }
  }
);

export const deleteStory = createAsyncThunk(
  'stories/delete',
  async (storyId, { rejectWithValue }) => {
    try {
      await api.delete(`/stories/${storyId}`);
      return storyId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete story'
      );
    }
  }
);

export const fetchStoryViews = createAsyncThunk(
  'stories/fetchViews',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stories/${storyId}/views`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch views'
      );
    }
  }
);

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    markStoryAsViewed: (state, action) => {
      const storyId = action.payload;
      if (!state.viewedStories.includes(storyId)) {
        state.viewedStories.push(storyId);
      }
    },
    clearViewedStories: (state) => {
      state.viewedStories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all stories
      .addCase(fetchAllStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchAllStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my stories
      .addCase(fetchMyStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyStories.fulfilled, (state, action) => {
        state.loading = false;
        state.myStories = action.payload;
      })
      .addCase(fetchMyStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user stories
      .addCase(fetchUserStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStories.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchUserStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create story
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.myStories.unshift(action.payload);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // View story
      .addCase(viewStory.fulfilled, (state, action) => {
        const { storyId } = action.payload;
        // Mark as viewed
        if (!state.viewedStories.includes(storyId)) {
          state.viewedStories.push(storyId);
        }
      })

      // Toggle like
      .addCase(toggleLikeStory.fulfilled, (state, action) => {
        // Update like count in stories if needed
      })

      // Delete story
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.loading = false;
        state.myStories = state.myStories.filter(
          (story) => story._id !== action.payload
        );
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentStory, markStoryAsViewed, clearViewedStories } =
  storySlice.actions;

export default storySlice.reducer;
