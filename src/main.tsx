import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './store/AppContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);

if (import.meta.env.VITE_ARTIFACT === '1') document.documentElement.classList.add('artifact');

if ('serviceWorker' in navigator && import.meta.env.PROD && import.meta.env.VITE_ARTIFACT !== '1') {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
