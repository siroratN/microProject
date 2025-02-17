import Users from '../model/Model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const Register = async (req, res) => {
    try {
        const { username, password, role, first_name, last_name } = req.body;
        if (!username || !password || !role || !first_name || !last_name) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
        // Hash รหัสผ่าน (saltRounds = 10 แนะนำเป็นค่ามาตรฐาน)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await Users.create({ username: username, password: hashedPassword, role: role, first_name: first_name, last_name: last_name });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to Register" });
    }
};


const Login = async(req, res) =>{
    try{
        const {username, password} = req.body
        if (!username || !password) {
            return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
        const user = await Users.findOne({ username });
        if(!user){
            return res.status(404).json({ error: "username ไม่ถูกต้อง" });
        }

        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
        }
        const JWT_SECRET = process.env.JWT;
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d", // อายุ Token 7 วัน
        });

        
        res.cookie("auth_token", token, {
            httpOnly: true,  
            secure: true,    
            sameSite: "Strict", 
            maxAge: 7 * 24 * 60 * 60 * 1000, // อายุ 7 วัน
        });

        res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ" });
    }
    catch(error){
        res.status(500).json({error:"Failed to Login"})
    }
}

export default Login;