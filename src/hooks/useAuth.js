import { useSelector } from 'react-redux';
import { USER_ROLES } from '../constants';

/**
 * Custom hook for authentication and authorization
 */
export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user?.role === USER_ROLES.ADMIN;
  };

  /**
   * Check if user can sell products (retailer, wholesaler, or admin)
   * @returns {boolean}
   */
  const canSell = () => {
    return hasAnyRole([USER_ROLES.RETAILER, USER_ROLES.WHOLESALER, USER_ROLES.ADMIN]);
  };

  /**
   * Check if user is a delivery personnel
   * @returns {boolean}
   */
  const isDeliveryPersonnel = () => {
    return user?.role === USER_ROLES.DELIVERY;
  };

  /**
   * Check if user is a customer
   * @returns {boolean}
   */
  const isCustomer = () => {
    return user?.role === USER_ROLES.CUSTOMER;
  };

  /**
   * Check if user has verified their account
   * @returns {boolean}
   */
  const isVerified = () => {
    return user?.isVerified === true;
  };

  /**
   * Check if user has completed KYC
   * @returns {boolean}
   */
  const hasCompletedKYC = () => {
    return user?.kycStatus === 'approved';
  };

  return {
    user,
    isAuthenticated,
    loading,
    hasRole,
    hasAnyRole,
    isAdmin,
    canSell,
    isDeliveryPersonnel,
    isCustomer,
    isVerified,
    hasCompletedKYC,
  };
};

export default useAuth;
