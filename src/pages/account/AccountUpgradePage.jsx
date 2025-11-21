import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';
import api from '../../services/api';
import { STORAGE_KEYS } from '../../constants';

const AccountUpgradePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const fromPage = location.state?.from;
  const [selectedPlan, setSelectedPlan] = useState('retailer');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessDescription: '',
    taxId: '',
  });

  const plans = [
    {
      id: 'retailer',
      name: 'Retailer',
      description: 'Perfect for individual sellers and small businesses',
      features: [
        'Upload unlimited products',
        'Manage inventory',
        'Process orders',
        'Customer messaging',
        'Sales analytics',
      ],
      price: 'Free',
    },
    {
      id: 'wholesaler',
      name: 'Wholesaler',
      description: 'Ideal for bulk sellers and distributors',
      features: [
        'All Retailer features',
        'Bulk pricing options',
        'Advanced inventory management',
        'Priority support',
        'Wholesale marketplace access',
        'API access',
      ],
      price: 'Contact Sales',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.businessName || !formData.businessAddress || !formData.businessPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/upgrade', {
        targetRole: selectedPlan,
        businessInfo: formData,
      });

      // Update user in Redux store and localStorage
      const updatedUser = response.data.user;
      dispatch(setUser(updatedUser));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      alert(response.data.message || 'Account upgraded successfully! You can now start selling products.');

      // Redirect to products page or back to where they came from
      navigate(fromPage || '/products/new');
    } catch (error) {
      console.error('Error submitting upgrade request:', error);
      alert(error.response?.data?.message || 'Failed to submit upgrade request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Account</h1>
          <p className="text-gray-600">
            Unlock the ability to sell products on Sokoni Africa
          </p>
        </div>
      </div>

      {/* Redirect Notice */}
      {fromPage && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            <div>
              <h3 className="font-semibold text-yellow-900">Access Restricted</h3>
              <p className="text-yellow-800 mt-1">
                You were redirected here because the page you tried to access requires upgraded permissions.
                Please upgrade your account to continue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Account Info */}
      {user && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Current Account Type</h3>
              <p className="text-blue-800 mt-1">
                You are currently registered as a{' '}
                <span className="font-bold capitalize">{user.role}</span>. To add and sell
                products, you need to upgrade to a Retailer or Wholesaler account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`card cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-primary-500 border-2 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-600">{plan.price}</div>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Business Information Form */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Enter your business name"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address *
            </label>
            <input
              type="text"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              placeholder="Enter your business address"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Phone *
            </label>
            <input
              type="tel"
              value={formData.businessPhone}
              onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
              placeholder="+254 700 000 000"
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID / Registration Number
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              placeholder="Optional"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description
            </label>
            <textarea
              value={formData.businessDescription}
              onChange={(e) =>
                setFormData({ ...formData, businessDescription: e.target.value })
              }
              placeholder="Tell us about your business..."
              rows={4}
              className="input-field w-full resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Upgrade Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountUpgradePage;
