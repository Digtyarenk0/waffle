import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { store } from 'entities/store/model';
import { WalletAppContextProvider } from 'entities/wallet/model/context';
import { BlockContextProvider } from 'entities/web3/model/context/block-context';

import { ErrorBoundary } from 'widgets/error-boundary/ui';

import { TelegramThemeProvider, TelegramWebProvider } from './providers/telegram';
import { RouterApp } from './router/ui/router';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  return (
    <ErrorBoundary>
      <TelegramWebProvider>
        <TelegramThemeProvider>
          <WalletAppContextProvider>
            <BlockContextProvider>
              <Provider store={store}>
                <BrowserRouter>
                  <RouterApp />
                  <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    theme="dark"
                  />
                </BrowserRouter>
              </Provider>
            </BlockContextProvider>
          </WalletAppContextProvider>
        </TelegramThemeProvider>
      </TelegramWebProvider>
    </ErrorBoundary>
  );
};
