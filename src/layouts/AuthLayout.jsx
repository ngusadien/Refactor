import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    // 1. Full Screen Container with Centering and Background Gradient
    // Use a soft, subtle gradient for the background
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-primary-50 via-white to-gray-50 px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-md">

        {/* 2. Logo/Brand Section */}
        {/* <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-600 mb-2 tracking-tight">
            {t('common.appName') || 'Sokoni'}
          </h1>
        </div> */}

        {/* 3. Content Card (Outlet) */}
        {/* This is the card that holds the Login/Register/etc. pages. */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100">
          {/* Outlet renders the current route component (e.g., LoginPage) */}
          <Outlet />
        </div>

        {/* 4. Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
          <p>
            &copy; 2025 <span className="font-semibold">Sokoni </span>. {t('common.allRightsReserved')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;