import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resetPassword, clearResetState } from '../../features/auth/authSlice';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, passwordResetSuccess } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [token, setToken] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Get token from URL
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setValidationError('Invalid or missing reset token');
    } else {
      setToken(resetToken);
    }

    // Clear reset state when component mounts
    dispatch(clearResetState());
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Redirect to login after successful password reset
    if (passwordResetSuccess) {
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Password reset successful! Please log in with your new password.'
          }
        });
      }, 2000);
    }
  }, [passwordResetSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError(t('errors.passwordsMismatch'));
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    await dispatch(resetPassword({ token, password: formData.password }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!token && !loading) {
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Invalid Reset Link
        </h2>
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="font-medium mb-2">Invalid or expired reset token</p>
          <p className="text-sm">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <div className="text-center space-y-2">
          <Link
            to="/forgot-password"
            className="block text-blue-600 hover:text-primary-700 font-medium"
          >
            Request New Reset Link
          </Link>
          <Link
            to="/login"
            className="block text-sm text-gray-600 hover:text-gray-900"
          >
            {t('auth.backToLogin')}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Reset Your Password
      </h2>

      {passwordResetSuccess ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <p className="font-medium mb-2">Password reset successful!</p>
            <p className="text-sm">
              Your password has been successfully reset. Redirecting you to login...
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your new password below.
          </p>

          {(error || validationError) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('auth.newPassword')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2.5 rounded-lg font-medium
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : 'Reset Password'}
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

export default ResetPasswordPage;
