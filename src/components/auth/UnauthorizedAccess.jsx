import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * UnauthorizedAccess - Component displayed when user doesn't have permission
 */
const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
            {user?.role && (
              <span className="block mt-2 text-sm">
                Your current role: <span className="font-semibold capitalize">{user.role}</span>
              </span>
            )}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full btn-secondary"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need access?</strong><br />
            Contact your administrator or check your account settings to upgrade your permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
