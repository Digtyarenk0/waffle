import { Navigate, Route, Routes } from 'react-router-dom';

import { routes } from 'shared/constants/routes';

import { Footer } from 'widgets/footer';

import { HomePage } from 'pages/home/ui/page';
import { ReceivePage } from 'pages/receive/ui/page';
import { SendToken } from 'pages/send-token';

export const RouterApp = () => {
  return (
    <div className="flex flex-col h-screen justify-between overflow-clip bg-[#213040]">
      <main className="h-[inherit] overflow-hidden">
        <Routes>
          <Route path={routes.main} element={<HomePage />} />
          <Route path={routes.receive} element={<ReceivePage />} />
          <Route path={routes.send} element={<SendToken />} />
          <Route path="*" element={<Navigate to={routes.main} replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
