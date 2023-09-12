const { User } = require('../db'); // Import the User model from db.js
const config = require('../config'); // Import the config file

module.exports = (bot, userStates, backButtonKeyboard, airdropJoiningBalance, referralBonus) => {
  bot.onText(/Account/, async (msg) => {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);

    if (state === 'mainMenu') {
      try {
        // Calculate Total Airdrop Balance (Airdrop Joining Balance + referral bonus)
        const totalAirdropBalance = airdropJoiningBalance + referralBonus;

        // Generate the referral link using config.botUsername
        const referralLink = `https://t.me/${config.botUsername}?start=${chatId}`;

        const existingUser = await User.findOne({ chatId });
        if (!existingUser) {
          // Create a new user document if it doesn't exist
          const newUser = new User({ chatId });
          await newUser.save();
        }

        // Count the user's referred friends
        const referredFriendsCount = await User.countDocuments({ referredBy: chatId });

        // Calculate the user's balance based on referral bonus
        const userBalance = referredFriendsCount * referralBonus;

        // Prepare the message with account details
        const message = `
🎁 Airdrop Reward: ${airdropJoiningBalance} JD
👫 Total Referral: ${referredFriendsCount} JD
💰 User Balance: ${userBalance} JD
🚀 Invite your friends and earn ${referralBonus} JD each referral.
💎 Referral Link: ${referralLink}
🔴 Please Remember: You will get these rewards only if you've completed all the tasks.
`;

        bot.sendMessage(chatId, message, {
          reply_markup: {
            inline_keyboard: [[{ text: 'Refresh', callback_data: 'refresh' }]],
          },
        });

        userStates.set(chatId, 'account');
      } catch (error) {
        console.error('Error handling "Account" button:', error);
        bot.sendMessage(chatId, 'An error occurred while processing your request.');
      }
    }
  });

  // Handle the "Back" button within the account context
  bot.onText(/Back/, (msg) => {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);

    if (state === 'account') {
      bot.sendMessage(chatId, 'Main Menu', backButtonKeyboard);
      userStates.set(chatId, 'mainMenu');
    }
  });

  // Handle the "Refresh" button callback
  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'refresh') {
      // Handle the refresh action here
      // You can update the user's data or perform any necessary actions
      bot.answerCallbackQuery(query.id, 'Refreshing data...', true);
      // Perform your data refresh logic here
    }
  });
};