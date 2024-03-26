import mongoose from 'mongoose';

const connectDB = async (url) => {
    console.log('Connecting to DB...')
    return mongoose.connect(url);
}

export default connectDB;