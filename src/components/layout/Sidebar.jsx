import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: t('nav.home'), icon: 'home' },
    // { path: '/stories', label: 'Stories', icon: 'stories' },
    // { path: '/products', label: t('nav.products'), icon: 'products' },
    { path: '/orders', label: t('nav.orders'), icon: 'orders' },
    { path: '/products/new', label: t('nav.upload'), icon: 'upload' },
    // { path: '/messages', label: t('nav.messages'), icon: 'messages' },
    // { path: '/warehouse', label: t('nav.warehouse'), icon: 'warehouse' },
    { path: '/profile', label: t('nav.profile'), icon: 'profile' },
    
  ];

  const isActive = (path) => location.pathname === path;

  // Icon component
  const Icon = ({ name, className }) => {
    const icons = {
      home: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      stories: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      products: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      orders: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      upload: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      messages: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      warehouse: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      profile: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    };

    return icons[name] || null;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden py-12 lg:flex lg:flex-col lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:w-64 lg:bg-gray-100 lg:shadow-lg lg:z-30">
        <div className="h-full flex flex-col py-6">
          {/* Menu Items - Desktop */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200',
                  {
                    'bg-primary-50 text-primary-600 font-medium': isActive(item.path),
                    'text-gray-700 hover:bg-gray-100': !isActive(item.path),
                  }
                )}
              >
                <Icon name={item.icon} className="w-6 h-6 shrink-0" />
                <span className="text-base">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg overflow-hidden">
        <div className="flex justify-around items-center h-14 sm:h-16 max-w-full">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full px-1 py-1 transition-colors duration-200 min-w-0',
                {
                  'text-primary-600': isActive(item.path),
                  'text-gray-600': !isActive(item.path),
                }
              )}
            >
              <Icon
                name={item.icon}
                className={clsx('w-5 h-5 sm:w-6 sm:h-6 shrink-0 mb-0.5', {
                  'stroke-2': isActive(item.path),
                })}
              />
              <span className={clsx('text-[10px] sm:text-xs truncate max-w-full px-0.5', {
                'font-semibold': isActive(item.path),
                'font-normal': !isActive(item.path),
              })}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
