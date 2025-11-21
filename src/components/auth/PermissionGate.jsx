import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';

/**
 * PermissionGate - Component-level permission check
 * Conditionally renders children based on user permissions
 *
 * @example
 * <PermissionGate allowedRoles={['admin', 'retailer']}>
 *   <button>Delete Product</button>
 * </PermissionGate>
 */
const PermissionGate = ({
  children,
  allowedRoles = [],
  requireVerified = false,
  requireKYC = false,
  fallback = null,
}) => {
  const { hasAnyRole, isVerified, hasCompletedKYC, isAuthenticated } = useAuth();

  // Not authenticated
  if (!isAuthenticated) {
    return fallback;
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return fallback;
  }

  // Check verification requirement
  if (requireVerified && !isVerified()) {
    return fallback;
  }

  // Check KYC requirement
  if (requireKYC && !hasCompletedKYC()) {
    return fallback;
  }

  return children;
};

PermissionGate.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requireVerified: PropTypes.bool,
  requireKYC: PropTypes.bool,
  fallback: PropTypes.node,
};

export default PermissionGate;
