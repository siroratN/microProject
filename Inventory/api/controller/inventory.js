dotenv.config();
const app = express();
import express from 'express';
import amqp from 'amqplib';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from '../model/Model.js';
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


app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// 🛒 API: เพิ่มสินค้าใหม่
app.post('/newproducts', async (req, res) => {
    try {
        const { name, quantity, threshold } = req.body; // รับข้อมูลจาก body
        const pro = new Product({ name, quantity, threshold });
        await pro.save();
        res.json(pro);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
});

// 🛒 API: อัปเดตจำนวนสินค้า
app.post('/update-stock', async (req, res) => {
    const { productId, quantityChange, action } = req.body;
    try {
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ error: "Product not found" });

        if (action == "IN") {
            product.quantity += quantityChange;
            await product.save();
        } else if (action == "OUT") {
            product.quantity -= quantityChange;
            await product.save();
        }


        if (product.quantity < product.threshold) {
            sendAlertMessage(product);
        }

        res.json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(500).json({ error: "Failed to update stock" });
    }
});

async function sendAlertMessage(product) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'alert_queue';

        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
            productId: product._id,
            name: product.name,
            quantity: product.quantity,
            message: "Stock is running low!"
        })));

        console.log(`[Inventory Service] 📢 Sent alert for product: ${product.name}`);
    } catch (error) {
        console.error("Error sending alert message:", error);
    }
}

app.listen(4001, async () => {
    await connectDB();
    console.log('Inventory running on port 4001');
});
