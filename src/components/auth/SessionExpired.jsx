import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

/**
 * SessionExpired - Component shown when user session expires
 */
const SessionExpired = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    dispatch(logout());
    navigate('/login', { state: { sessionExpired: true } });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Session Expired
          </h2>
          <p className="text-gray-600 mb-6">
            Your session has expired for security reasons. Please log in again to continue.
          </p>

          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
              <span className="text-2xl font-bold text-gray-700">{countdown}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to login in {countdown} seconds...
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full btn-primary"
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
