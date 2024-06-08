import { Navigate, Route, Routes } from 'react-router-dom';

import { routes } from 'shared/constants/routes';

import { useFetchTokensBalance } from 'features/tokens/model/hooks/tokens-balance/useTokensBalance';
import { useFetchTokensLists } from 'features/tokens/model/hooks/useTokenList';
import { useFeedTokens } from 'features/tokens/model/hooks/useTokenPrice';
import { ListsUpdater } from 'features/tokens/ui/list-updater';

import { Footer } from 'widgets/footer';

import { HomePage } from 'pages/home/ui/page';
import { ReceivePage } from 'pages/receive/ui/page';
import { SelectToken } from 'pages/select-token/ui/page';
import { SendTokenTo } from 'pages/send-token/ui/page';

export const RouterApp = () => {
  useFetchTokensLists();
  useFetchTokensBalance();
  useFeedTokens();

  return (
    <div className="flex flex-col h-screen justify-between bg-[#213040]">
      <div className="overflow-hidden h-[calc(100vh_-_66px)]">
        <Routes>
          <Route path={routes.main} element={<HomePage />} />
          <Route path={routes.receive} element={<ReceivePage />} />
          <Route path={routes.select_token} element={<SelectToken />} />
          <Route path={routes.send_token} element={<SendTokenTo />} />
          <Route path="*" element={<Navigate to={routes.main} replace />} />
        </Routes>
      </div>
      <Footer />
      <ListsUpdater />
    </div>
  );
};
