import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { forgotPassword, clearResetState } from '../../features/auth/authSlice';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error, resetEmailSent } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');

  useEffect(() => {
    // Clear reset state when component mounts
    dispatch(clearResetState());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(forgotPassword(email));
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {t('auth.forgotPassword')}
      </h2>

      {resetEmailSent ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <p className="font-medium mb-2">Reset link sent!</p>
            <p className="text-sm">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-blue-600 hover:text-primary-700 font-medium"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-blue-600 hover:text-primary-700 font-medium"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default ForgotPasswordPage;
