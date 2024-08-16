const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  category: String,
  date: Date,
  description: String
});

module.exports = mongoose.model('Transaction', transactionSchema);