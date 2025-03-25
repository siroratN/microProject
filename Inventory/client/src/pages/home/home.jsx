import { useState, useEffect } from "react";
import axios from "axios";
import PlusIcon from "../../components/PlusIcon";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    const newWindow = window.open(`http://localhost:3002/detail/${id}`, "_blank");
    setTimeout(() => {
      newWindow.postMessage({ productId: id }, "http://localhost:5174");
    }, 1000);
  };

  const fetchProducts = async (query = "") => {
    try {
      const url = query
        ? `http://localhost:5001/inventory/search?product=${query}`
        : "http://localhost:5001/inventory/getAllProducts";
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg shadow-md hover:bg-violet-700 transition"
          onClick={() => navigate("/addProduct")}
        >
          <PlusIcon />
          <span className="ml-2">เพิ่มสินค้า</span>
        </button>

        {/* Search Bar */}
        <form className="flex items-center w-1/2" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="ค้นหาสินค้า..."
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
          >
            ค้นหา
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <img
                className="w-full h-48 object-cover"
                src={
                  product.image}
                alt={product.name}
              />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-lg font-semibold text-gray-900">{product.name}</h5>
                  <span className="text-sm text-gray-600">{product.category?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-md font-medium text-gray-900">คงเหลือ: {product.quantity}</span>
                  <span className="text-md font-medium text-red-500">ขั้นต่ำ: {product.threshold}</span>
                </div>
                <button
                  className="mt-4 w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition"
                  onClick={() => handleNavigate(product._id)}
                >
                  ปรับจำนวนสินค้า
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">ไม่มีสินค้า</p>
        )}
      </div>
    </div>
  );
};

export default Home;