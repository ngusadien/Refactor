import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/products/productSlice';
import { fetchAllStories, fetchMyStories } from '../features/storySlice';
import StoryCircle from '../components/stories/StoryCircle';
import StoryViewer from '../components/stories/StoryViewer';
import AddStory from '../components/stories/AddStory';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: products, loading } = useSelector((state) => state.products);
  const { stories, myStories } = useSelector((state) => state.stories);
  const [showAddStory, setShowAddStory] = useState(false);
  const [viewingStories, setViewingStories] = useState(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 6 }));
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

  const allStories = myStories.length > 0 ? [{ user, stories: myStories, hasUnviewed: false }, ...stories] : stories;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('common.welcome')}, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Welcome to {t('common.appName')} - Your marketplace across Africa
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-primary-50 border-l-4 border-primary-600">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Products</h3>
          <p className="text-2xl font-bold text-primary-600">1,234</p>
        </div>
        <div className="card bg-secondary-50 border-l-4 border-secondary-600">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Orders</h3>
          <p className="text-2xl font-bold text-secondary-600">56</p>
        </div>
        <div className="card bg-blue-50 border-l-4 border-blue-600">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Messages</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="card bg-orange-50 border-l-4 border-orange-600">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Deliveries</h3>
          <p className="text-2xl font-bold text-orange-600">8</p>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{t('products.featured')}</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <Link
                key={product._id || product.id}
                to={`/products/${product._id || product.id}`}
                className="card hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-primary-600 font-bold">
                  KSh {product.price?.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stories Section */}
      {allStories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Stories from people you follow</h2>
            <Link to="/stories" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Add Story Button */}
            {user && (
              <div className="shrink-0">
                <div
                  onClick={() => setShowAddStory(true)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-700 mt-2 max-w-20 truncate text-center">
                    Add Story
                  </p>
                </div>
              </div>
            )}

            {/* Story Circles */}
            {allStories.slice(0, 10).map((userStories, index) => (
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
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/products" className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('nav.products')}</h3>
              <p className="text-sm text-gray-600">Browse marketplace</p>
            </div>
          </div>
        </Link>

        <Link to="/orders" className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('nav.orders')}</h3>
              <p className="text-sm text-gray-600">Manage your orders</p>
            </div>
          </div>
        </Link>

        <Link to="/messages" className="card hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('nav.messages')}</h3>
              <p className="text-sm text-gray-600">Chat with sellers</p>
            </div>
          </div>
        </Link>
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

export default HomePage;
