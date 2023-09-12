module.exports = function (bot, userStates) {
  bot.onText(/User/, (msg) => {
    const chatId = msg.chat.id;
    const state = userStates.get(chatId);

    if (state === 'mainMenu') {
      bot.sendMessage(chatId, 'Please enter your email address:', {
        reply_markup: {
          force_reply: true, // This will enable a force reply for the email address input
        },
      });
      userStates.set(chatId, 'enterEmail'); // Set the state to 'enterEmail'
    } else if (state === 'enterEmail') {
      // Handle the user's email address input here
      const userEmail = msg.text;

      // You can add further validation here to ensure the email is in the correct format
      if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(userEmail)) {
        // Valid email format
        bot.sendMessage(chatId, `You entered a valid email address: ${userEmail}`);
        // You can store the user's email address or process it as needed
        userStates.set(chatId, 'mainMenu'); // Return to the main menu state
      } else {
        // Invalid email format
        bot.sendMessage(chatId, 'Invalid email format. Please enter a valid email address.');
      }
    }
  });
};
