import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/dm-sans';
import App from './App.jsx';
import './index.css';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== 'true') return;
  try {
    const { worker } = await import('./lib/msw/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  } catch (error) {
    console.error('The mock server failed to start', error);
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});