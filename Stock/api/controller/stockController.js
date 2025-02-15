import axios from 'axios';
import StockLog from '../model/Model.js';

const log_stock = async (req, res) => {
    const { productId, quantityChange, action } = req.body;

    const stockLog = new StockLog({ productId, quantityChange, action });
    await stockLog.save();

    await axios.post('http://localhost:4001/update-stock', { productId, quantityChange, action });

    res.json({ message: "Stock movement recorded", stockLog });
};

export default log_stock;

