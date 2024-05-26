require('dotenv').config()
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const url = "";
  const opts = {
    reply_markup: {
      inline_keyboard: [[{ text: "Wallet" }]],
    },
  };
  bot.sendMessage(chatId, "Open the wallet to the left of the keyboard");
});
