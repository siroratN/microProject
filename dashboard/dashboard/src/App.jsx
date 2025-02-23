import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Table from "./components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
const Dashboard = () => {
  const [stock, setStock] = useState("")

  useEffect(() => {
    try {
      axios.get("http://localhost:5001/stock/dashboard_stock").then((res) => {
        setStock(res.data);
      });
      console.log(stock)
    } catch (error) {
      console.log("Error", error)
    }

  }, []);

  const data = [
    { date: "18th", thisWeek: 100, lastWeek: 80 },
    { date: "20th", thisWeek: 140, lastWeek: 90 },
    { date: "22nd", thisWeek: 160, lastWeek: 100 },
    { date: "24th", thisWeek: 170, lastWeek: 105 },
    { date: "26th", thisWeek: 175, lastWeek: 110 },
    { date: "28th", thisWeek: 180, lastWeek: 115 },
    { date: "30th", thisWeek: 160, lastWeek: 120 },
  ];

  const topItems = [
    { name: "Beautiful Chair", quantity: 12 },
    { name: "Modern Desk", quantity: 10 },
    { name: "Vintage Lamp", quantity: 8 },
    { name: "Cozy Sofa", quantity: 6 },
    { name: "Wooden Shelf", quantity: 4 },
  ]
  return (
    <div className="flex">
      


      
      <div className="p-6 flex-1 items-center">

        {/* Grid Layout เเสดง ข้างบน 3 อัน*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

          <div className="bg-red-500 p-4 rounded-lg text-white shadow-md text-center hover:bg-red-700">
            <h3 className="text-lg font-bold">All Inventory Quantity</h3>
            <p className="text-3xl font-semibold">4</p>

          </div>
          <div className="bg-blue-500 p-4 rounded-lg text-white shadow-md text-center">
            <h3 className="text-lg font-bold">Stock in number last 7 days</h3>
            <p className="text-3xl font-semibold">{stock?.data?.stock_in_7[0]?.totalQuantity}</p>
          </div>

          <div className="bg-purple-500 p-4 rounded-lg text-white shadow-md text-center">
            <h3 className="text-lg font-bold">Stock out number last 7 days</h3>
            <p className="text-3xl font-semibold">{stock?.data?.stock_out_7[0]?.totalQuantity}</p>
          </div>

        </div>

        {/* Grid Layout เเสดงข้างล่าง 4 อัน*/}
        <div className="grid grid-cols-2 gap-4 mt-8">

          <div className="p-4 bg-white  rounded-lg">
            <h2 className="text-lg font-semibold">Stock In & Stock Out last 7 days</h2>
            <p className="text-green-500">↑ 12.5% Since last week</p>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="thisWeek" stroke="#007bff" name="stock in" />
                <Line type="monotone" dataKey="lastWeek" stroke="#888888" name="stock out" />
              </LineChart>
            </ResponsiveContainer>
          </div>


          <Table title={"Top 5 products with the highest stock remaining"} items={topItems}/> {/*  table top 5 สินค้าที่ยังเหลือเยอะใน stock */}
          <Table title={"Top 5 products with the highest stockout rate"} items={stock?.data?.top5}/> {/*  table top 5 สินค้าที่ stockout มากสุด */}
          <Table title={"Top 5 products with the lowest stock remaining"} items={topItems}/> {/*  table top 5 สินค้าที่หลือน้อยสุด stock */}



        </div>

      </div>
    </div >
  );
};

export default Dashboard;
