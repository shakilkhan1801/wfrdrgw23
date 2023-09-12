const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true, index: true },
  telegramId: { type: Number, required: true, unique: true, index: true },
  referredBy: { type: Number, default: null },
  balance: { type: Number, default: 0 }, // Add a balance field
  telegramUsername: String,// Add a field for Telegram username
});

const User = mongoose.model('User', userSchema);

mongoose
  .connect('mongodb+srv://shakilhasan1801:cm8bbLuzON4PTCR2@cluster0.4ydrgvd.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });


module.exports = {
  User,
};