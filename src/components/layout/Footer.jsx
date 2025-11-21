import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto pb-14 sm:pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 rounded-lg p-1">
                <img
                  src="/images/default.png"
                  alt="Sokoni Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-primary-600">
                {t('common.appName')}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your vibrant marketplace connecting wholesalers, retailers, and customers across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('nav.orders')}
                </Link>
              </li>
               {/* <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link to="/warehouse" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('nav.warehouse')}
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@sokoni.africa</li>
              <li>Phone: +255 615 124 786</li>
              <li>Location: Mwanza, Tanzania</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2025 Sokoni. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
