import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchProfile, updateProfile } from '../../features/user/userSlice';
import { STORAGE_KEYS, LANGUAGES, THEMES } from '../../constants';
import { useToast } from '../../contexts/ToastContext';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  // Settings state
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem(STORAGE_KEYS.LANGUAGE) || LANGUAGES.EN
  );
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT
  );

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
      });
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        city: '',
        country: '',
      });
    }
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Language change handler
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    toast.success(`Language changed to ${lang === LANGUAGES.EN ? 'English' : 'Swahili'}`);
  };

  // Theme toggle handler
  const handleThemeToggle = () => {
    const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setCurrentTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);

    // Apply theme to document
    if (newTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast.success(`Theme changed to ${newTheme === THEMES.DARK ? 'Dark' : 'Light'} mode`);
  };

  // Apply theme on mount
  useEffect(() => {
    if (currentTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('profile.myProfile')}</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-outline">
            {t('common.edit')}
          </button>
        )}
      </div>

      <div className="card">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {formData.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.fullName')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.emailAddress')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.phoneNumber')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.city')}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.country')}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.address')}
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="input-field disabled:bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? t('common.loading') : t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-outline"
              >
                {t('common.cancel')}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Settings Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Settings</h3>

        <div className="space-y-6">
          {/* Language Selection */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900 mb-1">Language</h4>
              <p className="text-sm text-gray-600">Choose your preferred language</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange(LANGUAGES.EN)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentLanguage === LANGUAGES.EN
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange(LANGUAGES.SW)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentLanguage === LANGUAGES.SW
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Swahili
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900 mb-1">Theme</h4>
              <p className="text-sm text-gray-600">
                {currentTheme === THEMES.DARK ? 'Dark mode is enabled' : 'Light mode is enabled'}
              </p>
            </div>
            <button
              onClick={handleThemeToggle}
              className="relative inline-flex items-center h-10 w-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{
                backgroundColor: currentTheme === THEMES.DARK ? '#3B82F6' : '#D1D5DB',
              }}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                  currentTheme === THEMES.DARK ? 'translate-x-11' : 'translate-x-1'
                }`}
              >
                {currentTheme === THEMES.DARK ? (
                  <svg
                    className="h-8 w-8 text-blue-500 p-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-8 w-8 text-yellow-500 p-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.kycVerification')}</h3>
        <p className="text-gray-600 mb-4">Upload your documents for verification</p>
        <button className="btn-outline">
          {t('profile.uploadDocuments')}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
