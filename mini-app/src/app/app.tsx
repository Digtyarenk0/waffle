import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { routes } from 'shared/constants/routes';

import { ErrorBoundary } from 'widgets/error-boundary/ui';
import { Footer } from 'widgets/footer';

import { HomePage } from 'pages/home';

import { TelegramThemeProvider, TelegramWebProvider } from './providers/telegram';

import './index.css';

import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <TelegramWebProvider>
          <TelegramThemeProvider>
            <div className="w-full h-[100vh] relative overflow-hidden bg-black-theme">
              <Routes>
                <Route path={routes.main} element={<HomePage />} />
                <Route path="*" element={<Navigate to={routes.main} replace />} />
              </Routes>
              <Footer />
              <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                theme="dark"
              />
            </div>
          </TelegramThemeProvider>
        </TelegramWebProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
