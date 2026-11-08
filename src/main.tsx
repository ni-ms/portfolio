import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './theme/ThemeProvider';
import { RouterProvider } from './routing/Router';
import './styles/tokens.css';
import './styles/components.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider><RouterProvider><App /></RouterProvider></ThemeProvider>
  </StrictMode>
);
