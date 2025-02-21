import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // ✅ เพิ่ม axios

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/inventory/getProducts/${id}`);
        setProduct(response.data);
        setTempQuantity(response.data.quantity);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();

    const handleMessage = (event) => {
      if (event.origin === "http://localhost:5173" && event.data.productId) {
        console.log("Received Product ID:", event.data.productId);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [id]);

  const handleIncrease = () => setTempQuantity((prev) => prev + 1);
  const handleDecrease = () => setTempQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  const handleChange = (e) => setTempQuantity(Math.max(0, Number(e.target.value)));
  const handleConfirmChange = () => setIsModalOpen(true);

  const handleConfirm = async () => {
    try {
      await axios.put(`http://localhost:5001/inventory/updateQuantity/${id}`, {
        quantity: tempQuantity,
      });
      setProduct((prev) => ({ ...prev, quantity: tempQuantity }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (!product) return <p className="text-center mt-10">กำลังโหลด...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">รายละเอียดสินค้า</h1>
      <img
        className="w-64 mb-4"
        src={product.image || "https://cdn.example.com/default-image.jpg"}
        alt={product.name}
      />
      <h2 className="text-xl font-semibold">{product.name}</h2>

      <div className="flex items-center mt-4">
        <span className="text-lg font-medium mr-2">จำนวน:</span>
        <button onClick={handleDecrease} className="px-3 py-1 bg-red-500 text-white rounded-lg">
          -
        </button>
        <input
          type="number"
          className="border px-3 py-1 mx-2 rounded-lg w-24 text-center"
          value={tempQuantity}
          onChange={handleChange}
        />
        <button onClick={handleIncrease} className="px-3 py-1 bg-green-500 text-white rounded-lg">
          +
        </button>
        <button onClick={handleConfirmChange} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          บันทึก
        </button>
      </div>

      {/* ✅ Modal ยืนยัน */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">ยืนยันการเปลี่ยนแปลงจำนวนสินค้า?</h2>
            <p>จำนวนใหม่: {tempQuantity}</p>
            <div className="flex gap-4 mt-4">
              <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                ยืนยัน
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => window.location.href = "http://localhost:5173/home"} className="mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg">
        กลับหน้าแรก
      </button>
    </div>
  );
};

export default ProductDetail;
