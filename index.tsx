// Polyfill must be at the very top before any imports that might use process.env
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("AllEase: System bootstrapping...");

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AllEase: React mount successful.");
  } catch (err) {
    console.error("AllEase: Mount failure:", err);
  }
} else {
  console.error("Critical Error: Root element '#root' not found in document.");
}