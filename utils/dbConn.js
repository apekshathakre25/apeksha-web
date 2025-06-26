const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('Missing MongoDB Atlas connection string in MONGO_URI');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Atlas Connected');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
