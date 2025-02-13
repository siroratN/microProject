import express from 'express';
import axios from 'axios';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());

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
import StockLog from './model/Model.js';


app.post('/log-stock', async (req, res) => {
    const { productId, quantityChange, action } = req.body;

    const stockLog = new StockLog({ productId, quantityChange, action });
    await stockLog.save();

    await axios.post('http://localhost:4001/update-stock', { productId, quantityChange });

    res.json({ message: "Stock movement recorded", stockLog });
});

app.listen(4002, async () => {
    await connectDB();
    console.log('Stock Service running on port 4002');
});