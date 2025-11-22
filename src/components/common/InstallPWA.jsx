import { useState, useEffect } from 'react';
import { pwaInstallManager, isAppInstalled } from '../../utils/registerSW';

const InstallPWA = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isAppInstalled());

    // Subscribe to install prompt availability
    const unsubscribe = pwaInstallManager.subscribe((prompt) => {
      setCanInstall(!!prompt);
      if (prompt && !isAppInstalled()) {
        // Show banner after 5 seconds if not installed
        setTimeout(() => setShowBanner(true), 5000);
      }
    });

    return unsubscribe;
  }, []);

  const handleInstall = async () => {
    const result = await pwaInstallManager.promptInstall();

    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowBanner(false);
      setCanInstall(false);
    } else if (result.outcome === 'dismissed') {
      console.log('User dismissed the install prompt');
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !canInstall || !showBanner) {
    return null;
  }

  // Check if dismissed in this session
  if (sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <>
      {/* Mobile Banner (Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-linear-to-r from-primary-600 to-primary-700 text-white shadow-2xl sm:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Install Sokoni App</p>
                <p className="text-xs opacity-90 truncate">Quick access, offline mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-white text-primary-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Banner (Top) */}
      <div className="hidden sm:block fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-primary-600 to-primary-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold">Install Sokoni Africa App</p>
                <p className="text-sm opacity-90">Get quick access and work offline</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstall}
                className="px-6 py-2.5 bg-white text-primary-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-md"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstallPWA;
