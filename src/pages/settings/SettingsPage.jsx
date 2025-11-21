import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { setLanguage, setTheme } from '../../features/user/userSlice';
import { logout } from '../../features/auth/authSlice';
import { LANGUAGES, THEMES } from '../../constants';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settings } = useSelector((state) => state.user);

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
    // Apply theme switching logic
    localStorage.setItem('sokoni_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('settings.settings')}</h1>

      {/* Language Settings */}
      <div className="card bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.language')}</h2>
        <div className="space-y-2">
          <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="language"
              value={LANGUAGES.EN}
              checked={settings.language === LANGUAGES.EN}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="mr-3"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">English</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">English (US)</p>
            </div>
          </label>

          <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="language"
              value={LANGUAGES.SW}
              checked={settings.language === LANGUAGES.SW}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="mr-3"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Kiswahili</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Swahili</p>
            </div>
          </label>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.theme')}</h2>
        <div className="space-y-2">
          <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="theme"
              value={THEMES.LIGHT}
              checked={settings.theme === THEMES.LIGHT}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.light')}</p>
            </div>
          </label>

          <label className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              name="theme"
              value={THEMES.DARK}
              checked={settings.theme === THEMES.DARK}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.dark')}</p>
            </div>
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.notifications')}</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.emailNotifications')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive order updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.email}
              onChange={() => {/* Handle change */}}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.pushNotifications')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications on your device</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.push}
              onChange={() => {/* Handle change */}}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.smsNotifications')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive SMS updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications?.sms}
              onChange={() => {/* Handle change */}}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Account</h2>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
            {t('profile.changePassword')}
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {t('auth.logout')}
          </button>
          <button className="w-full text-left px-4 py-3 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
