import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';

// Immediate shim to prevent "ReferenceError: process is not defined"
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
}

const container = document.getElementById('root');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("AllEase: Initial mount failure", err);
  }
} else {
  console.error("AllEase: Critical error - Root element 'root' not found.");
}