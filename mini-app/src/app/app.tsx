import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { routes } from 'shared/constants/routes';

import { store } from 'entities/store/model';
import { WalletAppContextProvider } from 'entities/wallet/model/context';

import { ErrorBoundary } from 'widgets/error-boundary/ui';
import { Footer } from 'widgets/footer';

import { HomePage } from 'pages/home';
import { SendToken } from 'pages/send-token';

import { TelegramThemeProvider, TelegramWebProvider } from './providers/telegram';

import './index.css';

import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  return (
    <ErrorBoundary>
      <TelegramWebProvider>
        <TelegramThemeProvider>
          <WalletAppContextProvider>
            <Provider store={store}>
              <BrowserRouter>
                <div className="w-full h-[100vh] relative overflow-hidden bg-black-theme">
                  <Routes>
                    <Route path={routes.main} element={<HomePage />} />
                    <Route path={routes.send} element={<SendToken />} />
                    <Route path="*" element={<Navigate to={routes.main} replace />} />
                  </Routes>
                  <Footer />
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
                </div>
              </BrowserRouter>
            </Provider>
          </WalletAppContextProvider>
        </TelegramThemeProvider>
      </TelegramWebProvider>
    </ErrorBoundary>
  );
};
