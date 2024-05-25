require('dotenv').config()
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const url = "https://react-telegram-web-app.domain:3000";
  const opts = {
    reply_markup: {
      inline_keyboard: [[{ text: "Open Mini App", url: url }]],
    },
  };
  bot.sendMessage(chatId, "Нажмите кнопку ниже для открытия Mini App:", opts);
});
