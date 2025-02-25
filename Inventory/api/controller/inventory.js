import amqp from 'amqplib';
import {Product, Category} from '../model/Model.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const getProductsById = async (req, res) => {
    const productId = req.params.id;
    try {
        const products = await Product.findById(productId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product
            .find({ category: category })
            .populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const allCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { name, quantity, threshold, image, category } = req.body;
        const pro = new Product({ name, quantity, threshold, image, category });
        console.log(pro);
        await pro.save();
        res.json(pro);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateStock = async (req, res) => {
    const { productId, action, quantityChange } = req.body;
    try {
        const product = await Product.findById(productId);

        if (!product) return res.status(500).json(productId + " not found");

        if (action == "IN") {
            product.quantity += quantityChange;
            await product.save();
        } else if (action == "OUT") {
            product.quantity -= quantityChange;
            await product.save();
        }

        if (product.quantity < product.threshold) {
            sendAlertMessage(product);
        }

        res.json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(500).json({ error: "Failed to update stock" });
    }
};

async function sendAlertMessage(product) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'alert_queue';

    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({
        productId: product._id,
        name: product.name,
        quantity: product.quantity,
        message: "Stock is running low!"
    })));

    console.log(`Sent alert for product: ${product.name}`);
}
