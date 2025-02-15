const express = require('express');
const axios = require('axios'); // ใช้สำหรับเรียก API ไปยัง Inventory Service
const mongoose = require('mongoose');
const cors = require("cors");
const amqp = require("amqplib");

const app = express();
app.use(cors());  // เปิดการใช้งาน CORS
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/stock');

const StockLog = mongoose.model('StockLog', new mongoose.Schema({
    productId: String,
    name: String,
    quantityChange: Number,
    action: String, // "IN" หรือ "OUT"
    timestamp: { type: Date, default: Date.now }
}));


async function sendStockMovementToQueue(productId, quantityChange, action, name) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'stock_movement';

        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
            productId,
            name,
            quantityChange,
            action,
            timestamp: new Date()
        })));

        console.log(`[Stock Service] Sent stock movement: ${ productId }`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
    }
}


app.post('/log-stock', async (req, res) => {
    const { productId, quantityChange, action, name } = req.body;

    const stockLog = new StockLog({ productId, name, quantityChange, action });
    await stockLog.save();

    await axios.post('http://localhost:4001/update-stock', { productId, quantityChange });

    sendStockMovementToQueue(productId, quantityChange, action, name)
    res.json({ message: "Stock movement recorded", stockLog });
});




app.listen(4002, () => console.log('Stock Service running on port 4002'));
