const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    await setupIndexes();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const setupIndexes = async () => {
  try {
    console.log('Starting index setup...');
    const User = mongoose.model('User');
    
    const indexes = await User.collection.indexes();
    console.log('Existing indexes:', indexes);

    if (indexes.some(index => index.name === 'username_1')) {
      await User.collection.dropIndex('username_1');
      console.log('Dropped username index');
    }

    await User.collection.dropIndexes();
    console.log('Dropped all non-_id indexes');

    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Created unique index on email field');

    const finalIndexes = await User.collection.indexes();
    console.log('Final indexes:', finalIndexes);
  } catch (error) {
    console.error('Error setting up indexes:', error);
  }
};

module.exports = { connectDB };