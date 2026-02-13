import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("AllEase: System bootstrapping...");

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
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