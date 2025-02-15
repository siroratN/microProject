import mongoose from "mongoose";


const Report = mongoose.model('Report', new mongoose.Schema({
  productId: String,
  quantityChange: Number,
  name:String,
  action: String,
  timestamp: Date
}));

export default Report