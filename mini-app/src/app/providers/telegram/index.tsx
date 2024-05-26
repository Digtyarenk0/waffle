import { useThemeParams, WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { ConfigProvider, theme } from 'antd';

export const TelegramWebProvider = ({ children }: { children: React.ReactNode }) => (
  <WebAppProvider>{children}</WebAppProvider>
);

export const TelegramThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [_, themeParams] = useThemeParams();

  return (
    <ConfigProvider
      theme={
        themeParams.text_color
          ? {
              algorithm: theme.darkAlgorithm,
              token: {
                colorText: themeParams.text_color,
                colorPrimary: themeParams.button_color,
                colorBgBase: themeParams.bg_color,
              },
            }
          : undefined
      }
    >
      {children}
    </ConfigProvider>
  );
};
