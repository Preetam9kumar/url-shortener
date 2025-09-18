import mongoose from 'mongoose';
import "dotenv/config";

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database connected successfully');
}

export default connectDB;
