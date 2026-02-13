import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Resilience: Ensure process.env doesn't throw ReferenceError if the environment is missing it
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

console.log("AllEase: System bootstrapping...");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("AllEase: React mount successful.");
} else {
  console.error("Critical Error: Root element '#root' not found in document.");
}