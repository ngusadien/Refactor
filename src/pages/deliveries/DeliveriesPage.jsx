import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const DeliveriesPage = () => {
  const { t } = useTranslation();

  // Mock data
  const deliveries = [
    {
      id: 1,
      trackingNumber: 'DL001234',
      orderId: 'ORD001',
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      address: '123 Main St, Nairobi',
    },
    {
      id: 2,
      trackingNumber: 'DL001235',
      orderId: 'ORD002',
      status: 'out_for_delivery',
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      address: '456 Park Ave, Mombasa',
    },
    {
      id: 3,
      trackingNumber: 'DL001236',
      orderId: 'ORD003',
      status: 'delivered',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      address: '789 Ocean Rd, Kisumu',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      assigned: 'bg-gray-100 text-gray-800',
      picked_up: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-yellow-100 text-yellow-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    if (status === 'delivered') {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{t('deliveries.myDeliveries')}</h1>

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Side */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(delivery.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {delivery.trackingNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {t(`deliveries.${delivery.status}`) || delivery.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Order: #{delivery.orderId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {delivery.address}
                  </p>
                  {delivery.status !== 'delivered' && (
                    <p className="text-sm text-gray-600 mt-2">
                      {t('deliveries.estimatedTime')}: {format(delivery.estimatedDelivery, 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="btn-outline text-sm">
                  {t('deliveries.trackDelivery')}
                </button>
                {delivery.status !== 'delivered' && (
                  <button className="btn-outline text-sm">
                    Contact Driver
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            {delivery.status !== 'failed' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between relative">
                  {/* Progress Bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2">
                    <div
                      className="h-full bg-primary-600 transition-all duration-500"
                      style={{
                        width: delivery.status === 'delivered' ? '100%' :
                               delivery.status === 'out_for_delivery' ? '75%' :
                               delivery.status === 'in_transit' ? '50%' :
                               delivery.status === 'picked_up' ? '25%' : '0%'
                      }}
                    ></div>
                  </div>

                  {/* Steps */}
                  {['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].map((step, index) => {
                    const isCompleted = ['delivered', 'out_for_delivery', 'in_transit', 'picked_up', 'assigned'].slice(0,
                      ['delivered', 'out_for_delivery', 'in_transit', 'picked_up', 'assigned'].indexOf(delivery.status) + 1
                    ).includes(step);

                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center hidden sm:block">
                          {t(`deliveries.${step}`) || step.replace('_', ' ')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveriesPage;
