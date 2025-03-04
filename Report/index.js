const express = require("express");
const fs = require("fs");
const path = require("path");
const { format } = require("@fast-csv/format");
const cors = require("cors");
const amqp = require('amqplib'); // ใช้ RabbitMQ
const mongoose = require('mongoose');
const app = express();
app.use(cors());  // เปิดการใช้งาน CORS
app.use(express.json());




mongoose.connect('mongodb://localhost:27017/Report', { useNewUrlParser: true, useUnifiedTopology: true });

const Report = mongoose.model('Report', new mongoose.Schema({
  productId: String,
  quantityChange: Number,
  name:String,
  action: String,
  timestamp: Date
}));

const data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Doe", age: 28 },
  { id: 3, name: "Alice Smith", age: 35 },
];

app.get("/download-csv", (req, res) => {
  const filePath = path.join(__dirname, "data.csv");
  const ws = fs.createWriteStream(filePath);
  const csvStream = format({ headers: true });
  csvStream.pipe(ws);

  data.forEach((row) => csvStream.write(row));
  csvStream.end();

  ws.on("finish", () => {
    res.download(filePath, "data.csv", (err) => {
      if (err) console.error("Error downloading CSV:", err);
      fs.unlinkSync(filePath);
    });

  });
});

// rabbit mq
async function consumeStockMovementQueue() {
  try {
      const connection = await amqp.connect('amqp://localhost');
      const channel = await connection.createChannel();
      const queue = 'stock_movement';

      await channel.assertQueue(queue);

      channel.consume(queue, async (msg) => {
          if (msg !== null) {
              const stockData = JSON.parse(msg.content.toString());

              // บันทึกลงฐานข้อมูล
              const report = new Report(stockData);
              await report.save();

              console.log('[Report Service] ✅ Saved stock movement: ${stockData.productId}');
              channel.ack(msg);
          }
      });
  } catch (error) {
      console.error("Error consuming RabbitMQ:", error);
  }
}

consumeStockMovementQueue();



app.listen(4003, () => {
  console.log(`Server running at http://localhost:4003`);
});
