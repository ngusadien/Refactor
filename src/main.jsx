import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { registerSW } from 'virtual:pwa-register'
import { ToastProvider } from './contexts/ToastContext'
import './i18n'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Show a prompt to reload the page when new content is available
    if (confirm('New content available. Reload to update?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('✅ Sokoni Africa is ready to work offline!')
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registered successfully')
    if (registration) {
      // Check for updates every hour
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    }
  },
  onRegisterError(error) {
    console.error('Service Worker registration failed:', error)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </StrictMode>,
)
