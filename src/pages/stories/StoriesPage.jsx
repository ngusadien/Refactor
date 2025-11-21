import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories, fetchMyStories } from '../../features/storySlice';
import StoryCircle from '../../components/stories/StoryCircle';
import StoryViewer from '../../components/stories/StoryViewer';
import AddStory from '../../components/stories/AddStory';

const StoriesPage = () => {
  const dispatch = useDispatch();
  const { stories, myStories, loading } = useSelector((state) => state.stories);
  const { user } = useSelector((state) => state.auth);
  const [showAddStory, setShowAddStory] = useState(false);
  const [viewingStories, setViewingStories] = useState(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchAllStories());
    if (user) {
      dispatch(fetchMyStories());
    }
  }, [dispatch, user]);

  const handleStoryClick = (userStories, index) => {
    setViewingStories(userStories);
    setCurrentUserIndex(index);
  };

  const handleCloseViewer = () => {
    setViewingStories(null);
    // Refresh stories after viewing
    dispatch(fetchAllStories());
    if (user) {
      dispatch(fetchMyStories());
    }
  };

  const handleNextUser = () => {
    const allStories = myStories.length > 0 ? [{ user, stories: myStories }, ...stories] : stories;
    if (currentUserIndex < allStories.length - 1) {
      const nextIndex = currentUserIndex + 1;
      setCurrentUserIndex(nextIndex);
      setViewingStories(allStories[nextIndex]);
    } else {
      handleCloseViewer();
    }
  };

  const handlePrevUser = () => {
    const allStories = myStories.length > 0 ? [{ user, stories: myStories }, ...stories] : stories;
    if (currentUserIndex > 0) {
      const prevIndex = currentUserIndex - 1;
      setCurrentUserIndex(prevIndex);
      setViewingStories(allStories[prevIndex]);
    }
  };

  const handleAddStorySuccess = () => {
    dispatch(fetchMyStories());
    dispatch(fetchAllStories());
  };

  // Combine own stories with all stories
  const allStories = myStories.length > 0 ? [{ user, stories: myStories, hasUnviewed: false }, ...stories] : stories;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stories</h1>
          <p className="text-gray-600">
            Share your products and updates with the Sokoni community
          </p>
        </div>

        {/* Loading state */}
        {loading && allStories.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Stories grid */}
        {!loading && allStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="card inline-block">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 font-medium mb-4">No stories yet</p>
              <button
                onClick={() => setShowAddStory(true)}
                className="btn-primary"
              >
                Create Your First Story
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Add story card (always first) */}
            {user && (
              <div className="mb-8">
                <div
                  onClick={() => setShowAddStory(true)}
                  className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-linear-to-br from-primary-50 to-secondary-50 border-2 border-dashed border-primary-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create Story</h3>
                      <p className="text-sm text-gray-600">Share your products with followers</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stories horizontal scroll */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Stories</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {allStories.map((userStories, index) => (
                  <div key={userStories.user._id} className="shrink-0">
                    <StoryCircle
                      userStories={userStories}
                      onClick={() => handleStoryClick(userStories, index)}
                      currentUser={user}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* My Stories Section */}
            {myStories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Your Stories</h2>
                  <button
                    onClick={() => setShowAddStory(true)}
                    className="btn-primary text-sm"
                  >
                    + Add Story
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {myStories.map((story) => (
                    <div
                      key={story._id}
                      onClick={() => handleStoryClick({ user, stories: myStories }, 0)}
                      className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden p-0"
                    >
                      <div className="aspect-9/16 bg-gray-200 relative">
                        {story.mediaType === 'image' ? (
                          <img
                            src={story.mediaUrl}
                            alt="Story"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <img
                              src={story.thumbnail || story.mediaUrl}
                              alt="Story"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </>
                        )}

                        {/* Stats overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                          <div className="flex items-center gap-4 text-white text-sm">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>{story.viewCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{story.likeCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Stories Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Community Stories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {stories.map((userStories, index) => (
                  <div key={userStories.user._id}>
                    <StoryCircle
                      userStories={userStories}
                      onClick={() => handleStoryClick(userStories, myStories.length > 0 ? index + 1 : index)}
                      currentUser={user}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showAddStory && (
        <AddStory
          onClose={() => setShowAddStory(false)}
          onSuccess={handleAddStorySuccess}
        />
      )}

      {viewingStories && (
        <StoryViewer
          userStories={viewingStories}
          onClose={handleCloseViewer}
          onNext={handleNextUser}
          onPrev={handlePrevUser}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default StoriesPage;
