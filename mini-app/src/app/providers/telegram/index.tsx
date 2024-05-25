import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

export const TelegramWebProvider = ({ children }: { children: React.ReactNode }) => (
  <WebAppProvider>{children}</WebAppProvider>
);
