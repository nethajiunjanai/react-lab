import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './app/App';
import { AppProviders } from './app/providers';
import { store, persistor } from './store';

import './style.css';
import 'primeflex/primeflex.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
       <PersistGate
                loading={null}
                persistor={persistor}
            >
      <AppProviders>
        <App />
      </AppProviders>
      </PersistGate>
    </Provider>
  </StrictMode>,
);