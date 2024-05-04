import mongoose from 'mongoose';

const username = 'admin';
const password = 'Admin1212';
const host = '0.0.0.0';
const port = '27017'
const database = 'admin';

// //const url = 'mongodb://0.0.0.0:27017/admin';

const url = `mongodb://${username}:${password}@${host}:${port}/?authSource=${database}`;

const connectToMongo = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the application on connection failure
  }
};

connectToMongo()

