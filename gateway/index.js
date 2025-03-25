const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const allowedOrigins = [
    'http://localhost:3001',  
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {  
            callback(null, true);  
        } else {
            callback(new Error('Not allowed by CORS'));  
        }
    },
    credentials: true  
}));


app.use(express.json());
app.use(cookieParser()); 


const checkPermission = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const JWT_SECRET = process.env.JWT;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role === "employee" && requestedPath === "/report") {
            return res.status(403).json({ message: "Forbidden: Users are not allowed to access reports" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

app.use("/inventory", proxy("http://localhost:4001"));
app.use("/stock", proxy("http://localhost:4002"));
app.use("/authen", proxy("http://localhost:4003"));
app.use("/alert", proxy("http://localhost:4004"));
app.use("/report", checkPermission, proxy("http://localhost:4005"));

app.listen(5001, () => {
    console.log("Gateway is Listening to Port 5001");
});
