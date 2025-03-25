import Users from '../model/Model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const Register = async (req, res) => {
    try {
        const { username, password, role, first_name, last_name, email } = req.body;
        if (!username || !password || !role || !first_name || !last_name) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
        const check = await Users.findOne({ username });

        if (check) {
            return res.status(400).json({ error: "username นี้มีผู้ใช้เเล้ว" })
        }

        // Hash รหัสผ่าน (saltRounds = 10 แนะนำเป็นค่ามาตรฐาน)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await Users.create({ username: username, password: hashedPassword, role: role, first_name: first_name, last_name: last_name, email: email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
};


export const Login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
        const user = await Users.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "username หรือ password ไม่ถูกต้อง" });
        }

        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ error: "username หรือ password ไม่ถูกต้อง" });
        }
        const JWT_SECRET = process.env.JWT;
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        });


        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            domain: "localhost",
            maxAge: 1 * 60 * 60 * 1000, // 1 ชั่วโมง
        });
        console.log("test cookie:", token)

        res.status(200).json({ message: "Login Successful!!" })
    }
    catch (error) {
        res.status(500).json({ error })
    }
}

export const Logout = (req, res) => {
    try {
        res.cookie("auth_token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            domain: "localhost",
            expires: new Date(0),
        });

        res.status(200).json({ message: "Logout Successful!!" });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการ logout" });
    }
};


export const checkPermission = async (req, res) => {
    try {
        // ดึง token จาก cookie
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(200).json({role:"none"})
        }
        const JWT_SECRET = process.env.JWT;
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Token ไม่ถูกต้องหรือหมดอายุ" });
        }

        const user = await Users.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้" });
        }

        res.status(200).json({
            userId: decoded.userId,
            role: user.role,

        });
    } catch (error) {
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" });
    }
};
