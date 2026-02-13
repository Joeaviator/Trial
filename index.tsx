import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

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
    // Visual fallback for deployment debugging
    rootElement.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; background: #0F172A; color: #94A3B8; min-height: 100vh;">
        <h2 style="color: #F1F5F9; font-weight: 900; letter-spacing: -0.05em;">CRITICAL_BOOT_FAILURE</h2>
        <p style="font-family: monospace; font-size: 12px; margin-top: 20px;">${err instanceof Error ? err.message : String(err)}</p>
      </div>
    `;
  }
} else {
  console.error("Critical Error: Root element '#root' not found in document.");
}