import axios from 'axios';
import Report from '../model/Model.js';
import amqp from 'amqplib';


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
const createReport = async (req, res) =>{
    const { productId, quantityChange, action, name } = req.body;
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
}

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