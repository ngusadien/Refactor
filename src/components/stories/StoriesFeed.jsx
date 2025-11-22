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
    // Filter out current user from stories to avoid duplication
    const otherUsersStories = user
      ? stories.filter(userStory => userStory.user._id !== user._id)
      : stories;
    const allStories = myStories.length > 0 ? [{ user, stories: myStories }, ...otherUsersStories] : otherUsersStories;

    if (currentUserIndex < allStories.length - 1) {
      const nextIndex = currentUserIndex + 1;
      setCurrentUserIndex(nextIndex);
      setViewingStories(allStories[nextIndex]);
    } else {
      handleCloseViewer();
    }
  };

  const handlePrevUser = () => {
    // Filter out current user from stories to avoid duplication
    const otherUsersStories = user
      ? stories.filter(userStory => userStory.user._id !== user._id)
      : stories;
    const allStories = myStories.length > 0 ? [{ user, stories: myStories }, ...otherUsersStories] : otherUsersStories;

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

  // Filter out current user's stories from the general stories array to avoid duplication
  const otherUsersStories = user
    ? stories.filter(userStory => userStory.user._id !== user._id)
    : stories;

  // Combine own stories with filtered stories (only if user has stories)
  // Current user's stories should ALWAYS be in one circle, regardless of how many
  const allStories = myStories.length > 0
    ? [{ user, stories: myStories, hasUnviewed: false }, ...otherUsersStories]
    : otherUsersStories;

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
          {/* Add Story Circle - Show when user has no stories */}
          {user && myStories.length === 0 && (
            <div className="shrink-0">
              <button
                onClick={() => setShowAddStory(true)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="relative">
                  {/* Avatar with dashed border */}
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 p-[3px] group-hover:border-primary-500 transition-colors">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Your avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {(user.name || user.fullName)?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plus button at bottom - intersecting */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-7 h-7 bg-black rounded-full border-2 border-white flex items-center justify-center group-hover:bg-gray-800 transition-colors shadow-md z-10">
                    <svg
                      className="w-3.5 h-3.5 text-white"
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
                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors mt-3 font-medium">
                  You
                </span>
              </button>
            </div>
          )}

          {/* Story Circles */}
          {allStories.map((userStories, index) => (
            <div key={userStories.user._id} className="shrink-0">
              <StoryCircle
                userStories={userStories}
                onClick={() => handleStoryClick(userStories, index)}
                onAddStory={() => setShowAddStory(true)}
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
