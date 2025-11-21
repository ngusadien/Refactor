import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../constants';

const StoryCircle = ({ userStories, onClick, currentUser }) => {
  const { user, stories, hasUnviewed } = userStories;
  const isOwnStory = currentUser?._id === user._id;

  // Get the API URL base without /api suffix
  const baseUrl = API_BASE_URL.replace('/api', '');

  // Get the first story's thumbnail or user avatar with full URL
  const getThumbnailUrl = () => {
    const story = stories[0];
    if (!story) return null;

    if (story.mediaType === 'video' && story.thumbnail) {
      return story.thumbnail.startsWith('http') ? story.thumbnail : `${baseUrl}${story.thumbnail}`;
    }

    if (story.mediaUrl) {
      return story.mediaUrl.startsWith('http') ? story.mediaUrl : `${baseUrl}${story.mediaUrl}`;
    }

    return null;
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer group"
    >
      {/* Story Circle with gradient border (Instagram style) */}
      <div className="relative">
        {/* Gradient border for unviewed stories */}
        <div
          className={`w-20 h-20 rounded-full p-[3px] ${
            hasUnviewed && !isOwnStory
              ? 'bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600'
              : 'bg-gray-300'
          }`}
        >
          {/* White padding */}
          <div className="w-full h-full rounded-full p-[3px] bg-white">
            {/* Image container */}
            <div className="w-full h-full rounded-full overflow-hidden">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={user.name || user.fullName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              ) : user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.fullName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
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
        </div>

        {/* Add icon for own story */}
        {isOwnStory && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
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
          </div>
        )}

        {/* Story count badge */}
        {stories.length > 1 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs font-bold">{stories.length}</span>
          </div>
        )}
      </div>

      {/* Username */}
      <p className="text-xs text-gray-700 mt-2 max-w-20 truncate text-center font-medium">
        {isOwnStory ? 'Your Story' : (user.name || user.fullName)}
      </p>
    </div>
  );
};

StoryCircle.propTypes = {
  userStories: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    stories: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        mediaType: PropTypes.string.isRequired,
        mediaUrl: PropTypes.string.isRequired,
        thumbnail: PropTypes.string,
      })
    ).isRequired,
    hasUnviewed: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default StoryCircle;
