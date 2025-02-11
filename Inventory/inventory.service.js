const express = require('express');
const amqp = require('amqplib'); // ใช้ RabbitMQ
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/inventory', { useNewUrlParser: true, useUnifiedTopology: true });

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    quantity: Number,
    threshold: Number, // ค่าต่ำสุดสำหรับแจ้งเตือน
}));

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
    const { productId, quantityChange } = req.body;
    try {
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ error: "Product not found" });

        product.quantity -= quantityChange;
        await product.save();

        // 📢 แจ้งเตือนถ้าสินค้าเหลือน้อย
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

// เปิด server ที่ port 4001
app.listen(4001, () => console.log('Inventory running on port 4001'));
