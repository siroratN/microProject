import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [image, setImage] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("http://localhost:5001/inventory/addProduct", {
                name,
                category,
                quantity,
                threshold,
                image
            });
            setLoading(false);
            navigate("/home");
        } catch (error) {
            console.error("Error adding product:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("http://localhost:5001/inventory/allCategories");
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="p-6 max-w-2xl mx-auto ">
            <h2 className="text-xl font-bold text-gray-700 mb-6 text-center mt-32">เพิ่มสินค้าใหม่</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">ชื่อสินค้า</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-600">จำนวน</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="threshold" className="block text-sm font-medium text-gray-600">จำนวนขั้นต่ำ</label>
                    <input
                        type="number"
                        id="threshold"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-600">ลิงค์ภาพสินค้า</label>
                    <input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-600">หมวดหมู่</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-violet-700 text-white rounded-md hover:bg-violet-800"
                    disabled={loading}
                >
                    {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
