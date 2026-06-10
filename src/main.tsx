import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initNative, isNative } from './native';

// In the packaged native shell we use hash routing for robust in-app navigation
// (no server to fall back to index.html); the web build keeps clean URLs.
const Router = isNative ? HashRouter : BrowserRouter;

void initNative();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
