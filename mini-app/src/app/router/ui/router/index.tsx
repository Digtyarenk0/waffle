import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { routes } from 'shared/constants/routes';

import { useFetchTokensBalance } from 'features/tokens/model/hooks/tokens-balance/useTokensBalance';
import { useFetchTokensLists } from 'features/tokens/model/hooks/useTokenList';
import { useFeedTokens } from 'features/tokens/model/hooks/useTokenPrice';
import { ListsUpdater } from 'features/tokens/ui/list-updater';

import { Footer } from 'widgets/footer';

import { HomePage } from 'pages/home/ui/page';
import { ReceivePage } from 'pages/receive/ui/page';
import { SelectToken } from 'pages/select-token/ui/page';
import { SendToken } from 'pages/send-token/ui/page';

export const RouterApp = () => {
  const navigate = useNavigate();
  useFetchTokensLists();
  useFetchTokensBalance();
  useFeedTokens();

  return (
    <div className="bg-white-main flex flex-col">
      <div>
        <Routes>
          <Route path={routes.main} element={<HomePage />} />
          <Route path={routes.receive} element={<ReceivePage />} />
          <Route path={routes.select_token} element={<SelectToken />} />
          <Route path={routes.send_token} element={<SendToken />} />
          <Route path="*" element={<Navigate to={routes.main} replace />} />
        </Routes>
      </div>
      <Footer />
      <ListsUpdater />
      <BackButton onClick={() => navigate(routes.main)} />
    </div>
  );
};
