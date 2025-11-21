import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { viewStory, toggleLikeStory, deleteStory } from '../../features/storySlice';
import { API_BASE_URL } from '../../constants';

const StoryViewer = ({ userStories, initialStoryIndex = 0, onClose, onNext, onPrev, currentUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const progressInterval = useRef(null);
  const touchStartX = useRef(null);

  const { user, stories } = userStories;
  const currentStory = stories[currentIndex];
  const isOwnStory = currentUser?._id === user._id;
  const duration = currentStory?.duration || 5000;

  // Get the API URL base without /api suffix
  const baseUrl = API_BASE_URL.replace('/api', '');

  // Helper function to get full URL for media
  const getFullMediaUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  // Record view when story is shown
  useEffect(() => {
    if (currentStory && !isOwnStory) {
      dispatch(viewStory(currentStory._id));
    }
  }, [currentStory, dispatch, isOwnStory]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused) return;

    setProgress(0);
    const increment = 100 / (duration / 50); // Update every 50ms

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else if (onPrev) {
      onPrev();
    }
  };

  const handleLike = () => {
    if (!isOwnStory && currentStory) {
      dispatch(toggleLikeStory(currentStory._id));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      await dispatch(deleteStory(currentStory._id));
      if (stories.length === 1) {
        onClose();
      } else {
        handleNext();
      }
    }
  };

  const handleProductClick = () => {
    if (currentStory?.product?._id) {
      navigate(`/products/${currentStory.product._id}`);
    }
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // Click handlers for left/right navigation
  const handleClick = (e) => {
    const { clientX } = e;
    const { innerWidth } = window;

    if (clientX < innerWidth / 3) {
      handlePrev();
    } else if (clientX > (innerWidth * 2) / 3) {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {stories.map((story, index) => (
          <div key={story._id} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || user.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(user.name || user.fullName)?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* User info */}
          <div>
            <p className="text-white font-semibold text-sm">{user.name || user.fullName}</p>
            <p className="text-gray-300 text-xs">
              {new Date(currentStory.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Pause/Play */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
          >
            {isPaused ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>

          {/* Options menu */}
          {isOwnStory && (
            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {showOptions && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg py-2 min-w-[150px]">
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                  >
                    Delete Story
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Story content */}
      <div
        className="relative w-full h-full max-w-lg mx-auto cursor-pointer"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentStory.mediaType === 'image' ? (
          <img
            src={getFullMediaUrl(currentStory.mediaUrl)}
            alt="Story"
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error('Failed to load image:', currentStory.mediaUrl);
              e.target.src = '/images/default.png';
            }}
          />
        ) : (
          <video
            src={getFullMediaUrl(currentStory.mediaUrl)}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
            onError={(e) => {
              console.error('Failed to load video:', currentStory.mediaUrl);
            }}
          />
        )}

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-0 right-0 px-4">
            <p className="text-white text-center bg-black/50 px-4 py-2 rounded-lg">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Product CTA */}
        {currentStory.product && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={handleProductClick}
              className="w-full card bg-white/95 hover:bg-white flex items-center gap-3 transition-all"
            >
              {currentStory.product.image && (
                <img
                  src={getFullMediaUrl(currentStory.product.image)}
                  alt={currentStory.product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 line-clamp-1">
                  {currentStory.product.title}
                </p>
                <p className="text-primary-600 font-bold">
                  KSh {currentStory.product.price?.toLocaleString()}
                </p>
              </div>
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Like button (bottom center) */}
      {!isOwnStory && (
        <button
          onClick={handleLike}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm"
        >
          <svg
            className={`w-7 h-7 ${currentStory.likes?.includes(currentUser?._id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
            fill={currentStory.likes?.includes(currentUser?._id) ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}

      {/* Stats for own story */}
      {isOwnStory && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
          <div className="text-center">
            <p className="text-white text-2xl font-bold">{currentStory.viewCount || 0}</p>
            <p className="text-gray-300 text-sm">Views</p>
          </div>
          <div className="text-center">
            <p className="text-white text-2xl font-bold">{currentStory.likeCount || 0}</p>
            <p className="text-gray-300 text-sm">Likes</p>
          </div>
        </div>
      )}
    </div>
  );
};

StoryViewer.propTypes = {
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
        caption: PropTypes.string,
        duration: PropTypes.number,
        product: PropTypes.object,
        createdAt: PropTypes.string,
        viewCount: PropTypes.number,
        likeCount: PropTypes.number,
        likes: PropTypes.array,
      })
    ).isRequired,
  }).isRequired,
  initialStoryIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  currentUser: PropTypes.object,
};

export default StoryViewer;
