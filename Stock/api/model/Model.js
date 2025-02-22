import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
    productId: String,
    quantityChange: Number,
    action: String, // "IN" or "OUT"
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("StockLog", stockLogSchema);