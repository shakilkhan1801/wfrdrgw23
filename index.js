const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { User } = require('./db');
const accountCommand = require('./commands/account');
const referCommand = require('./commands/refer');
const userCommand = require('./commands/user');
const config = require('./config'); // Import the config file

// Define a keyboard for the "User" menu with the "Back" button
const userMenuKeyboard = {
  reply_markup: {
    keyboard: [['Back']],
    resize_keyboard: true
  },
};

// Declare and initialize Airdrop Joining Bonus and Referral Bonus using the imported values
const airdropJoiningBalance = config.airdropJoiningBalance;
const referralBonus = config.referralBonus;

// Create a bot instance
const bot = new TelegramBot(config.token, { polling: true });

// Define a variable to store the user's current state
const userStates = new Map();

// Define the mainMenuKeyboard here
const mainMenuKeyboard = {
  reply_markup: {
    keyboard: [['User'], ['Account', 'Refer'], ['📊 Statistics', 'ℹ Information']],
    resize_keyboard: true
  },
};

// Define backButtonKeyboard
const backButtonKeyboard = {
  reply_markup: {
    keyboard: [['Back']],
  },
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id; // Get the Telegram user's ID
  const state = userStates.get(chatId);

  if (state === 'mainMenu') {
    bot.sendMessage(chatId, 'Welcome to the bot!', mainMenuKeyboard);
  } else if (state === 'userMenu') {
    bot.sendMessage(chatId, 'User Menu', userMenuKeyboard);
  }

  userStates.set(chatId, 'mainMenu');

  try {
    const existingUser = await User.findOne({ chatId });
    if (!existingUser) {
      // Create a new user document with both chatId and telegramId
      const newUser = new User({ chatId, telegramId });
      await newUser.save();
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
});

// Handle the "User" button
bot.onText(/User/, (msg) => {
  const chatId = msg.chat.id;
  userStates.set(chatId, 'userMenu'); // Set the user's state to 'userMenu'
  ///bot.sendMessage(chatId, 'User Menu', userMenuKeyboard);
});

// Handle the "Back" button
bot.onText(/Back/, (msg) => {
  const chatId = msg.chat.id;
  userStates.set(chatId, 'mainMenu'); // Make sure you transition the state here
  console.log('User pressed Back button'); // Add a debug log
  bot.sendMessage(chatId, 'Main Menu', mainMenuKeyboard);
});

// Import and use the command modules, passing airdropJoiningBalance and referralBonus from config
accountCommand(bot, userStates, backButtonKeyboard, airdropJoiningBalance, referralBonus);
referCommand(bot, userStates);
userCommand(bot, userStates);

// ... Handle other commands or messages as in your example ...

// Start listening for incoming messages
bot.on('polling_error', (error) => {
  console.error(error);
});

console.log('Bot is running...');