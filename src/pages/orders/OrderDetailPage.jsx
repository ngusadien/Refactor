import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchOrderById, cancelOrder } from '../../features/orders/orderSlice';
import { format } from 'date-fns';
import { getProductImageUrl } from '../../utils/imageHelper';

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      await dispatch(cancelOrder(id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('common.back')}
      </button>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('orders.orderDetails')} #{order.orderNumber || (order._id || order.id).slice(-8)}
            </h1>
            <p className="text-sm text-gray-600">
              {order.createdAt && format(new Date(order.createdAt), 'MMMM dd, yyyy HH:mm')}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {t(`orders.${order.status}`) || order.status}
          </span>
        </div>

        {/* Order Items */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                  {getProductImageUrl(item) ? (
                    <img
                      src={getProductImageUrl(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="font-semibold text-primary-600">KSh {item.price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t mt-6 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">KSh {order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">KSh {order.shipping?.toLocaleString() || 'Free'}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-primary-600">KSh {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.status === 'pending' || order.status === 'confirmed' ? (
          <div className="border-t mt-6 pt-6">
            <button onClick={handleCancelOrder} className="btn-outline text-red-600 border-red-600 hover:bg-red-50">
              {t('orders.cancelOrder')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetailPage;
