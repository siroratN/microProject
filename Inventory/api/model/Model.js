import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        quantity: { type: Number, required: true },
        threshold: { type: Number, required: true },
        image: { type: String, required: true },
    },
    { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);

export { Category, Product };
