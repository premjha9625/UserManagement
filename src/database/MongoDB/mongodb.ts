import mongoose from 'mongoose';
const url = 'mongodb://0.0.0.0:27017/admin';
const connectToMongo = async () => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit the application on connection failure
  }
};


export default connectToMongo;