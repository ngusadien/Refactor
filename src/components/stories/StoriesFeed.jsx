import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStories, fetchMyStories } from '../../features/storySlice';
import StoryCircle from './StoryCircle';
import StoryViewer from './StoryViewer';
import AddStory from './AddStory';

const StoriesFeed = () => {
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

  if (loading && allStories.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 py-12">
        {/* <h2 className="text-lg font-semibold text-gray-900 mb-3">Stories</h2> */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Add Story Circle - Always show for authenticated users */}
          {user && (
            <div className="shrink-0">
              <button
                onClick={() => setShowAddStory(true)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="relative">
                  {/* Avatar with gradient border */}
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary-400 to-secondary-400 p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src="/images/default.png"
                        alt="Your avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Plus icon at bottom right - Instagram style */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                  Your Story
                </span>
              </button>
            </div>
          )}

          {/* Other Stories */}
          {allStories.map((userStories, index) => (
            <div key={userStories.user._id} className="shrink-0">
              <StoryCircle
                userStories={userStories}
                onClick={() => handleStoryClick(userStories, index)}
                currentUser={user}
              />
            </div>
          ))}

          {/* Empty state when no stories */}
          {!user && allStories.length === 0 && (
            <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
              No stories available
            </div>
          )}
        </div>
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
    </>
  );
};

export default StoriesFeed;
