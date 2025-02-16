import axios from 'axios';
import Report from '../model/Model.js';
import amqp from 'amqplib';
import path from "path";
import { fileURLToPath } from 'url';
import { format } from '@fast-csv/format';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

              console.log('[Report Service]  Saved stock movement: ${stockData.productId}');
              channel.ack(msg);
          }
      });
  } catch (error) {
      console.error("Error consuming RabbitMQ:", error);
  }
}

consumeStockMovementQueue();


const data = [
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Doe", age: 28 },
  { id: 3, name: "Alice Smith", age: 35 },
];

// {
//   "products": ["67ab605a6ebb49d25c4dbac4", "67ab605a6ebb49d25c4dbac4"],
//   "timestamp_start": "2/13/2025",
//   "timestamp_end": "2/17/2025"
// }

const createReport = async (req, res) => {
    const {products, timestamp_start, timestamp_end} = req.body; // products เก็บข้อมูล list productId ที่ผู้ใช้ เลือก (ถ้าไม่เลือกให้ default เป็นเลือกหมดทุกอัน)
    // console.log(timestamp_start)
    const filter = {};

    // ถ้ามีการเลือก products (ต้องเป็น array ที่มีสมาชิก)
    if (products && Array.isArray(products) && products.length > 0) {
      filter.productId = { $in: products };
    }

    // ถ้ามีการระบุวันเริ่มต้นหรือวันสิ้นสุด
    if (timestamp_start || timestamp_end) {
      filter.timestamp = {};
      if (timestamp_start) {
        // แปลง string เป็น Date object
        filter.timestamp.$gte = new Date(timestamp_start);
      }
      if (timestamp_end) {
        filter.timestamp.$lte = new Date(timestamp_end);
      }
    }

    // ทำการ query ด้วย filter ที่กำหนด
    const reports = await Report.find(filter).lean();
    // res.status(200).json(reports);

    const filePath = path.join(__dirname, "data.csv");
    const ws = fs.createWriteStream(filePath);
    const csvStream = format({ headers: true });
    csvStream.pipe(ws);
  
    reports.forEach((row) => csvStream.write(row));
    csvStream.end();
  
    ws.on("finish", () => {
      res.download(filePath, "data.csv", (err) => {
        if (err) console.error("Error downloading CSV:", err);
        fs.unlinkSync(filePath);
      });
    });
};


export default createReport

// app.get("/download-csv", (req, res) => {
//   const filePath = path.join(__dirname, "data.csv");
//   const ws = fs.createWriteStream(filePath);
//   const csvStream = format({ headers: true });
//   csvStream.pipe(ws);

//   data.forEach((row) => csvStream.write(row));
//   csvStream.end();

//   ws.on("finish", () => {
//     res.download(filePath, "data.csv", (err) => {
//       if (err) console.error("Error downloading CSV:", err);
//       fs.unlinkSync(filePath);
//     });

//   });
// });