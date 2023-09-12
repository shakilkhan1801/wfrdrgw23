const { User } = require('../db');
const config = require('../config');

module.exports = function (bot, userStates, backButtonKeyboard) {
  bot.onText(/Refer/, async (msg) => {
    const chatId = msg.chat.id; // Get the chat ID
    const telegramId = msg.from.id; // Get the Telegram user's ID

    try {
      // Check if a user with the provided chatId already exists
      const existingUser = await User.findOne({ chatId });

      if (!existingUser) {
        // Create a new user document with chatId and telegramId
        const newUser = new User({ chatId, telegramId, referredBy: null }); // Initialize referredBy as null
        await newUser.save();

        console.log(`✅ Refer Button Working: New user registered: ${chatId}`); // Button worked successfully
      }

      // Check if the user was referred
      const referredChatId = msg.text.split(' ')[1]; // Assuming the referral link format is "/Refer <referralChatId>"
      if (referredChatId) {
        // Find the user who referred the new user
        const referringUser = await User.findOne({ chatId: referredChatId });

        if (referringUser) {
          // Update the referredBy field for the new user
          existingUser.referredBy = referringUser.chatId;
          await existingUser.save();

          console.log(`✅ Refer Button Working: User ${existingUser.chatId} referred by ${referringUser.chatId}`); // Button worked successfully

          // Add referral bonus to both referrer and referred user
          const referralBonus = config.referralBonus;

          referringUser.balance += referralBonus;
          existingUser.balance += referralBonus;

          await referringUser.save();
          await existingUser.save();

          console.log(`✅ Refer Button Working: Referral bonus added to users ${referringUser.chatId} and ${existingUser.chatId}`); // Button worked successfully
        }
      }

      // Generate the referral link using config.botUsername
      const referralLink = `https://t.me/${config.botUsername}?start=${chatId}`;

      // Prepare the message with referral details
      const message = `Your Referral Link: ${referralLink}`;

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error(`❌ Refer Button Error: ${error.message}`); // Button encountered an error
      bot.sendMessage(chatId, 'An error occurred while processing your request.');
    }
  });
};