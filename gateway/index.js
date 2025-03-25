const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const allowedOrigins = [
    'http://localhost:3001', //inventory
    'http://localhost:3002', //stock
    'http://localhost:3003', //authen
    // 'http://localhost:3004', //alert
    'http://localhost:3005', //report
    'http://localhost:3006', //dashboard
];

app.use(cors({
    origin: function (origin, callback) {
        // ตรวจสอบว่า origin เป็น localhost และพอร์ตใดๆ
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
            callback(null, true); // allow the request
        } else {
            console.log("Blocked CORS from:", origin);
            callback(new Error("Not allowed by CORS")); // block the request
        }
    },
    credentials: true, // ให้สามารถส่ง cookies ไปด้วยได้
}));


app.use(express.json());
app.use(cookieParser());

const checkAuthentication = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ 
            authenticated: false,
            message: "กรุณาเข้าสู่ระบบก่อน",
            redirect: "http://localhost:3003/login"  // URL ของหน้า login
        });
    }

    try {
        const JWT_SECRET = process.env.JWT;
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            authenticated: false,
            message: "เซสชันหมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่",
            redirect: "http://localhost:3003/login"
        });
    }
};

// Check permission middleware (for admin-only routes)
const checkPermission = (req, res, next) => {
    if (req.user.role === "employee") {
        return res.status(403).json({ 
            authenticated: true,
            authorized: false,
            message: "คุณไม่มีสิทธิ์เข้าถึงรายงาน"
        });
    }
    next();
};

app.use("/inventory", checkAuthentication, proxy("http://localhost:4001"));
app.use("/stock", checkAuthentication, proxy("http://localhost:4002"));
app.use("/authen", proxy("http://localhost:4003"));
app.use("/alert", checkAuthentication, proxy("http://localhost:4004"));
app.use("/report", checkAuthentication, checkPermission, proxy("http://localhost:4005"));
app.use("/dashboard", checkAuthentication, proxy("http://localhost:4006"));

app.get("/check-auth", checkAuthentication, (req, res) => {
    res.json({ 
        authenticated: true, 
        user: {
            id: req.user.id,
            username: req.user.username,
            role: req.user.role
        }
    });
});

app.get("/check-report-access", checkAuthentication, (req, res) => {
    if (req.user.role === "employee") {
        return res.json({ 
            authenticated: true,
            authorized: false,
            message: "คุณไม่มีสิทธิ์เข้าถึงรายงาน"
        });
    }
    res.json({ authenticated: true, authorized: true });
});

app.listen(5001, () => {
    console.log("Gateway is Listening to Port 5001");
});