const express = require("express");
const fs = require("fs");
const path = require("path");
const { format } = require("@fast-csv/format");
const cors = require("cors");

const app = express();
app.use(cors());  // เปิดการใช้งาน CORS
app.use(express.json());

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

app.listen(4003, () => {
  console.log(`Server running at http://localhost:4003`);
});
