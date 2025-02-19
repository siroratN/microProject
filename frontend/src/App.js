import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4001/api/inventory/getProducts").then((res) => {
            setProducts(res.data);
        });
    }, []);

    return (
        <div>
            <h2>📦 Inventory</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} style={{ color: product.quantity < product.threshold ? "red" : "black" }}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
