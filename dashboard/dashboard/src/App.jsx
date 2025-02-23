import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Table from "./components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
const Dashboard = () => {
  const [stock, setStock] = useState("")
  const [inventory, setinventory] = useState("")
  useEffect(() => {
    axios.get("http://localhost:5001/stock/dashboard_stock")
      .then((res) => {
        console.log("API Data:", res.data);
        setStock(res.data);
      })
      .catch((error) => console.log("Error fetching stock data:", error));

    axios.get("http://localhost:5001/inventory/dashboard_inventory")
      .then((res)=>{
        setinventory(res.data)
      })
      .catch((error)=>{console.log("Error fetching inventory data: "), error})

  }, []);



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
            <p className="text-3xl font-semibold">{inventory?.data?.all_quantity[0]?.totalQuantity}</p>

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
              <LineChart data={stock?.data?.graph}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="stockIn" stroke="#007bff" name="stock in" />
                <Line type="monotone" dataKey="stockOut" stroke="#888888" name="stock out" />
              </LineChart>
            </ResponsiveContainer>
          </div>


          <Table title={"Top 5 products with the highest stock remaining"} items={inventory?.data?.top5_most}/> {/*  table top 5 สินค้าที่ยังเหลือเยอะใน stock */}
          <Table title={"Top 5 products with the highest stockout rate"} items={stock?.data?.top5}/> {/*  table top 5 สินค้าที่ stockout มากสุด */}
          <Table title={"Top 5 products with the lowest stock remaining"} items={inventory?.data?.top5_less}/> {/*  table top 5 สินค้าที่หลือน้อยสุด stock */}



        </div>

      </div>
    </div >
  );
};

export default Dashboard;
