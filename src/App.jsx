import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { STORAGE_KEYS, THEMES } from './constants';

// Pages (will be created)
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import ProductUploadPage from './pages/products/ProductUploadPage';
import CartPage from './pages/cart/CartPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import MessagesPage from './pages/messages/MessagesPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import AccountUpgradePage from './pages/account/AccountUpgradePage';
import WarehousePage from './pages/warehouse/WarehousePage';
import DeliveriesPage from './pages/deliveries/DeliveriesPage';
import StoriesPage from './pages/stories/StoriesPage';
import NotFoundPage from './pages/NotFoundPage';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Components
import InstallPWA from './components/common/InstallPWA';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import UnauthorizedAccess from './components/auth/UnauthorizedAccess';
import SessionExpired from './components/auth/SessionExpired';

// Constants
import { USER_ROLES } from './constants';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    // Apply saved theme on app mount
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || THEMES.LIGHT;
    if (savedTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Listen for session expiry events
    const handleSessionExpired = () => {
      setShowSessionExpired(true);
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  return (
    <>
      <InstallPWA />
      {showSessionExpired && <SessionExpired onClose={() => setShowSessionExpired(false)} />}
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
              
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/products"
            element={
              <ProtectedRoute>
                  <HomePage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/products/new"
            element={
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.RETAILER, USER_ROLES.WHOLESALER, USER_ROLES.ADMIN]}
              >
                <ProductUploadPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/upgrade"
            element={
              <ProtectedRoute>
                <AccountUpgradePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse"
            element={
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.RETAILER, USER_ROLES.WHOLESALER, USER_ROLES.ADMIN]}
              >
                <WarehousePage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/deliveries"
            element={
              <RoleBasedRoute
                allowedRoles={[USER_ROLES.DELIVERY, USER_ROLES.ADMIN]}
                redirectTo="/unauthorized"
              >
                <DeliveriesPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <StoriesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Unauthorized Access */}
        <Route path="/unauthorized" element={<UnauthorizedAccess />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
