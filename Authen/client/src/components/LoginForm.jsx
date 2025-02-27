import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/authen/login", {
        username,
        password,
      }, { withCredentials: true }); // สำหรับส่ง cookie

      alert(response.data.message); // แสดงข้อความสำเร็จ
    } catch (err) {
      setError(err.response.data.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-full">
        <input
          type="text"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-[#7D79FC]"
          >
            {showPassword ? "ซ่อน" : "แสดง"}
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#7D79FC] text-white py-2 rounded hover:bg-[#4F4ADC] transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
