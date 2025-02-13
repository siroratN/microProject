const express = require('express');
const axios = require('axios'); // ใช้สำหรับเรียก API ไปยัง Inventory Service
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
app.use(cors());  // เปิดการใช้งาน CORS
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb://localhost:27017/stock');

const StockLog = mongoose.model('StockLog', new mongoose.Schema({
    productId: String,
    quantityChange: Number,
    action: String, // "IN" หรือ "OUT"
    timestamp: { type: Date, default: Date.now }
}));

app.post('/log-stock', async (req, res) => {
    const { productId, quantityChange, action } = req.body;

    const stockLog = new StockLog({ productId, quantityChange, action });
    await stockLog.save();

    await axios.post('http://localhost:4001/update-stock', { productId, quantityChange });

    res.json({ message: "Stock movement recorded", stockLog });
});


  

app.listen(4002, () => console.log('Stock Service running on port 4002'));
