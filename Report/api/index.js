import express from 'express';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());
import reportController from './controller/reportController.js';

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

app.use("/api/report", reportController);

app.listen(4003, async () => {
    await connectDB();
    console.log('Stock Service running on port 4003');
});