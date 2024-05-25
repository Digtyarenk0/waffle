import { HomePage } from "../pages/home";
import { TelegramWebProvider } from "./providers/telegram";
import "../index.css";

export const App = () => {
  return (
    <TelegramWebProvider>
      <HomePage />
    </TelegramWebProvider>
  );
};
