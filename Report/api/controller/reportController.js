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




// {
//   "products": ["67ab605a6ebb49d25c4dbac4", "67ab605a6ebb49d25c4dbac4"],
//   "timestamp_start": "2/13/2025",
//   "timestamp_end": "2/17/2025"
// }
const filePath = path.join(__dirname, "data.csv");

export const createReport = async (req, res) => {
  try {
    const { products, timestamp_start, timestamp_end, reportName } = req.body;
    const filter = {};

    if (Array.isArray(products) && products.length > 0) {
      filter.productId = { $in: products };
    }

    if ((timestamp_start || timestamp_end)&& (timestamp_start !== timestamp_end)) {
      filter.timestamp = {};
      if (timestamp_start) filter.timestamp.$gte = new Date(timestamp_start);
      if (timestamp_end) filter.timestamp.$lte = new Date(timestamp_end);
    }

    const reports = await Report.find(filter).select("-__v").lean();
    if (!reports.length) {
      return res.status(404).json({ message: "No data found" });
    }

    const ws = fs.createWriteStream(filePath);
    const csvStream = format({ headers: true });

    csvStream.pipe(ws);
    reports.forEach((row) => csvStream.write(row));
    csvStream.end();

    ws.on("finish", () => {
      console.log("CSV file generated:", filePath);
      res.status(200).json({ message: "Report created", downloadUrl: "/report/Createreport/download" });
    });

    ws.on("error", (err) => {
      console.error("Error writing CSV:", err);
      res.status(500).json({ message: "Error generating file" });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const downloadReport = (req, res) => {
  res.download(filePath, "data.csv", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      return res.status(500).json({ message: "Error downloading file" });
    }
    
    // ✅ ลบไฟล์หลังจากดาวน์โหลดเสร็จ
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  });
};



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