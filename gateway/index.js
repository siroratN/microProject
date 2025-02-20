const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/inventory", proxy("http://localhost:4001"));
app.use("/stock", proxy("http://localhost:4002"));
app.use("/alert", proxy("http://localhost:4004"));
app.use("/authen", proxy("http://localhost:4003"));

app.listen(5001, () => {
    console.log("Gateway is Listening to Port 5001");
});