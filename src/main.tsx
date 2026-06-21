import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign sandbox HMR websocket rejections and errors
if (typeof window !== 'undefined') {
  // Wrap standard console methods to suppress Vite / WebSocket noise
  const filterViteLogs = (originalFn: (...args: any[]) => void) => {
    return (...args: any[]) => {
      const shouldSuppress = args.some((arg) => {
        if (!arg) return false;
        if (typeof arg === 'string') {
          const lower = arg.toLowerCase();
          return (
            lower.includes('[vite]') ||
            lower.includes('websocket') ||
            lower.includes('hmr') ||
            lower.includes('connection')
          );
        }
        if (typeof arg === 'object') {
          const msg = arg.message || '';
          if (typeof msg === 'string') {
            const lower = msg.toLowerCase();
            return (
              lower.includes('[vite]') ||
              lower.includes('websocket') ||
              lower.includes('hmr') ||
              lower.includes('connection')
            );
          }
        }
        return false;
      });

      if (!shouldSuppress) {
        originalFn(...args);
      }
    };
  };

  console.log = filterViteLogs(console.log);
  console.warn = filterViteLogs(console.warn);
  console.error = filterViteLogs(console.error);
  console.info = filterViteLogs(console.info);
  console.debug = filterViteLogs(console.debug);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (
      reason &&
      ((typeof reason === 'string' && reason.includes('WebSocket')) ||
        (reason.message && reason.message.includes('WebSocket')) ||
        (reason.stack && reason.stack.includes('WebSocket')) ||
        (reason.message && reason.message.includes('websocket')))
    ) {
      event.preventDefault();
      // Silenced completely
    }
  });

  window.addEventListener('error', (event) => {
    if (
      event.message &&
      (event.message.includes('WebSocket') || event.message.includes('websocket'))
    ) {
      event.preventDefault();
      // Silenced completely
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

