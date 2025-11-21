import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * RoleBasedRoute - Protects routes based on user roles
 * @param {React.ReactNode} children - Child components to render
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @param {string} redirectTo - Path to redirect unauthorized users (defaults to /account/upgrade)
 */
const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/account/upgrade'
}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // No role restrictions - allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    // Redirect unauthorized users to upgrade page
    return <Navigate to={redirectTo} replace state={{ from: window.location.pathname }} />;
  }

  return children;
};

RoleBasedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
};

export default RoleBasedRoute;
