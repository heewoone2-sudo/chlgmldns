// Ensure window.fetch has both a getter and a setter so injected monitoring/proxy scripts don't throw
if (typeof window !== 'undefined') {
  try {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch') || 
                 (typeof Window !== 'undefined' ? Object.getOwnPropertyDescriptor(Window.prototype, 'fetch') : undefined);
    if (!desc || !desc.set) {
      let currentFetch = window.fetch;
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(newFetch) {
          currentFetch = newFetch;
        },
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    // ignore
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  console.error("Target container 'root' was not found in document.");
}
