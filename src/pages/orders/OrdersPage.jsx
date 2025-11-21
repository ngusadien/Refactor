import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../features/orders/orderSlice';
import { format } from 'date-fns';

const OrdersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('orders.myOrders')}</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No orders yet</p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id || order.id}
              to={`/orders/${order._id || order.id}`}
              className="card hover:shadow-lg transition-shadow duration-200 block"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">
                      #{order.orderNumber || (order._id || order.id).slice(-8)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t(`orders.${order.status}`) || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.items?.length || 0} items • KSh {order.total?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.createdAt && format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex items-center text-primary-600">
                  <span className="text-sm font-medium">{t('orders.orderDetails')}</span>
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
