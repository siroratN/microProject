import mongoose from "mongoose";


const Report = mongoose.model('Report', new mongoose.Schema({
  productId: String,
  quantityChange: Number,
  name: String,
  action: String,
  timestamp: Date
}, { versionKey: false })); // ✅ ปิด __v

export default Report