import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login } from '../../features/auth/authSlice';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [sessionMessage, setSessionMessage] = useState('');

  useEffect(() => {
    // Check if redirected due to session expiry
    if (searchParams.get('session') === 'expired') {
      setSessionMessage('Your session has expired. Please log in again.');
    } else if (location.state?.sessionExpired) {
      setSessionMessage('Your session has expired. Please log in again.');
    } else if (location.state?.from) {
      setSessionMessage(`Please log in to access ${location.state.from}`);
    }
  }, [searchParams, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(login(formData));

    if (result.type === 'auth/login/fulfilled') {
      // Redirect to the page they were trying to access, or home
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo, { replace: true });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {t('auth.login')}
      </h2>

      {/* Session Message */}
      {sessionMessage && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg text-sm border border-yellow-300">
          {sessionMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-300">
          <strong>{t('common.error')}:</strong> {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t('auth.email')}
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t('auth.password')}
          </label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          />
        </div>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-primary-700"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('auth.login')}
        </button>
      </form>

      {/* Register section */}
      <div className="mt-6 space-y-3">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <Link
          to="/register"
          className="block w-full bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50
                     py-2.5 rounded-lg font-medium text-center shadow-sm transition"
        >
          {t('auth.register')}
        </Link>

        <p className="text-center text-xs text-gray-500">
          {t('auth.dontHaveAccount')}
        </p>
      </div>
    </>
  );
};

export default LoginPage;
