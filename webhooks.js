const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config'); // Import your bot's configuration

const app = express();
const port = 3000; // You can change this to your desired port

// Create a bot instance
const bot = new TelegramBot(config.token);

// Set up middleware for parsing incoming requests as JSON
app.use(bodyParser.json());

// Define the webhook endpoint (URL)
const webhookPath = '/your-webhook-path'; // Replace with your desired path
const webhookUrl = `https://yourdomain.com${webhookPath}`; // Replace with your domain and path

// Set up the webhook with Telegram
bot.setWebHook(webhookUrl);

// Handle incoming updates (messages, callbacks, etc.)
app.post(webhookPath, (req, res) => {
  const update = req.body;
  bot.processNewUpdate(update);
  res.sendStatus(200);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Webhook server is running on port ${port}`);
});
