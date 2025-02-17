import express from 'express';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());
import authenController from './controller/authenController.js';
app.use(cookieParser());

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("db success")

        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
}

app.use("/api/authen", authenController);

app.listen(4004, async () => {
    await connectDB();
    console.log('Stock Service running on port 4004');
});