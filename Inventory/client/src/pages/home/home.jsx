import { useState, useEffect } from "react";
import axios from "axios";
import Settings from "../../components/settings";
import PlusIcon from "../../components/PlusIcon";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    const newWindow = window.open(`http://localhost:5174/detail/${id}`, "_blank");
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
      console.log(response);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle submit ของฟอร์มค้นหา
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  return (
    <>
      <div className="grid grid-cols-3 p-4">
        <div
          className="flex items-center text-violet-800 cursor-pointer bg-opacity-50 bg-violet-400 p-2 w-32 rounded-md"
          onClick={() => navigate("/addProduct")}
        >
          <PlusIcon />
          <span className="ml-2">เพิ่มสินค้า</span>
        </div>

        <div className="col-span-2">
          <form
            className="flex items-center"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              id="simple-search"
              name="product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg px-10 p-2.5 w-full"
            />
            <button
              type="submit"
              className="p-2.5 ms-2 text-sm font-medium text-white bg-violet-700 rounded-lg border border-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300"
            >
                <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* แสดงรายการสินค้า */}
      <div className="grid grid-cols-3 gap-7">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="w-full max-w-sm transition duration-300 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50"
            >
              <img
                className="p-8 rounded-t-lg"
                src={
                  product.image ||
                  "https://cdn-dhpod.nitrocdn.com/ciLqvltLGzQghvUohHGIDrpOdslNfbyn/assets/images/optimized/rev-2300483/www.mtkwood.com/wp-content/uploads/2020/08/464232-PFPXVY-410-scaled.jpg"
                }
                alt={product.name}
              />
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold tracking-tight text-gray-900 text-md">
                    {product.name}
                  </h5>
                  <div className="text-violet-500" onClick={() => handleNavigate(product._id)}>
                    <Settings />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    จำนวน {product.quantity}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    จำนวนขั้นต่ำ {product.threshold}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">ไม่มีสินค้า</p>
        )}
      </div>
    </>
  );
};

export default Home;
