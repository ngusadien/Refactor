import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const WarehousePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('inventory');

  // Mock data
  const warehouses = [
    { id: 1, name: 'Nairobi Main Warehouse', location: 'Nairobi, Kenya', capacity: 1000, occupied: 750 },
    { id: 2, name: 'Mombasa Warehouse', location: 'Mombasa, Kenya', capacity: 500, occupied: 320 },
  ];

  const inventory = [
    { id: 1, product: 'Product A', sku: 'SKU001', quantity: 150, warehouse: 'Nairobi Main' },
    { id: 2, product: 'Product B', sku: 'SKU002', quantity: 80, warehouse: 'Nairobi Main' },
    { id: 3, product: 'Product C', sku: 'SKU003', quantity: 45, warehouse: 'Mombasa' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('warehouse.myWarehouses')}</h1>
        <button className="btn-primary">Add Warehouse</button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('warehouse.inventory')}
          </button>
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'warehouses'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Warehouses
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warehouses.map((warehouse) => (
            <div key={warehouse.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                  <p className="text-sm text-gray-600">{warehouse.location}</p>
                </div>
                <button className="text-primary-600 hover:text-primary-700">
                  View
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">
                      {warehouse.occupied} / {warehouse.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(warehouse.occupied / warehouse.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-outline text-sm">
                    {t('warehouse.addStock')}
                  </button>
                  <button className="flex-1 btn-outline text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warehouse
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.product}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.quantity > 100
                          ? 'bg-green-100 text-green-800'
                          : item.quantity > 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-primary-600 hover:text-primary-700 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
