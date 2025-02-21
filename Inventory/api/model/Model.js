import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        threshold: { type: Number, required: true },
        image: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("products", productSchema);