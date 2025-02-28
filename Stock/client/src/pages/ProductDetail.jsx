import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
      const quantityDiff = tempQuantity - product.quantity;

      if (quantityDiff === 0) {
        setIsModalOpen(false);
        return;
      }
      const action = quantityDiff > 0 ? "IN" : "OUT";
      
      await axios.post(`http://localhost:5001/stock/updateQuantity/${id}`, {
        productId: id,
        quantityChange: Math.abs(quantityDiff),
        action
      });

      setProduct((prev) => ({ ...prev, quantity: tempQuantity }));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  if (!product) return <p className="text-center mt-10 text-lg font-semibold text-gray-600">กำลังโหลด...</p>;

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{product.name}</h1>
      <img
        className="w-full h-64 object-cover rounded-lg mb-4"
        src={product.image || "https://cdn.example.com/default-image.jpg"}
        alt={product.name}
      />

      <div className="text-center text-lg font-medium text-gray-700">จำนวนสินค้า: {product.quantity}</div>
      
      <div className="flex justify-center items-center mt-6 gap-4">
        <button onClick={handleDecrease} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          -
        </button>
        <input
          type="number"
          className="border px-4 py-2 text-center rounded-lg w-24 text-gray-800"
          value={tempQuantity}
          onChange={handleChange}
        />
        <button onClick={handleIncrease} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
          +
        </button>
      </div>

      <button onClick={handleConfirmChange} className="block w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center">
        บันทึกการเปลี่ยนแปลง
      </button>

      {/* Modal ยืนยัน */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ยืนยันการเปลี่ยนแปลงจำนวนสินค้า?</h2>
            <p className="text-gray-700">จำนวนใหม่: {tempQuantity}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={handleConfirm} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                ยืนยัน
              </button>
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => window.location.href = "http://localhost:5173/home"} 
        className="block w-full mt-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-center"
      >
        กลับหน้าแรก
      </button>
    </div>
  );
};

export default ProductDetail;
