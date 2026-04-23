import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './app/App';
import { AppProvider } from './app/providers/AppContext';
import { store } from './app/store/store';
import { queryClient } from './shared/api/queryClient';
import './app/styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <App />
        </AppProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
