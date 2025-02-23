import axios from 'axios';
import StockLog from '../model/Model.js';
import amqp from 'amqplib';


async function sendStockMovementToQueue(productId, quantityChange, action, name) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'stock_movement';

        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify({
            productId,
            name,
            quantityChange,
            action,
            timestamp: new Date()
        })));

        console.log(`Stock save in stocklogs: ${productId}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
    }
}


export const log_stock = async (req, res) => {
    // const productId = req.params.id;
    const { productId, name,quantityChange, action } = req.body;

    const stockLog = new StockLog({ productId, quantityChange, name, action });
    await stockLog.save();

    await axios.post('http://localhost:5001/inventory/updateStock', { productId, quantityChange, name,action });
    sendStockMovementToQueue(productId, quantityChange, action)

    res.json({ message: "Stock movement recorded", stockLog });
};

export const dashboard_stock = async (req, res) => {

    const data = {
        stock_in_7: "",
        stock_out_7: "",
        top5: "",
    }
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    // 1) sum quantity stock in  7 วันที่ผ่านมา


    const stockInData = await StockLog.aggregate([
        {
            $match: {
                action: "IN", // ดึงเฉพาะ stock ที่เข้ามา
                timestamp: { $gte: sevenDaysAgo } // เฉพาะ 7 วันที่ผ่านมา
            }
        },
        {
            $group: {
                _id: null,
                totalQuantity: { $sum: "$quantityChange" } // รวมจำนวน stock ที่เข้า
            }
        }
    ]);

    data.stock_in_7 = stockInData

    // 2)  sum quantity stock out 7 วันที่ผ่านมา

    const stockOutData = await StockLog.aggregate([
        {
            $match: {
                action: "OUT", // ดึงเฉพาะ stock ที่เข้ามา
                timestamp: { $gte: sevenDaysAgo } // เฉพาะ 7 วันที่ผ่านมา
            }
        },
        {
            $group: {
                _id: null,
                totalQuantity: { $sum: "$quantityChange" } 
            }
        }
    ]);

    data.stock_out_7 = stockOutData
    // 3) top 5 สินค้า stock out มากสุด 

    const top5_data = await StockLog.aggregate([
        {
            $match: {
                action: "OUT" 
            }
        },
        {
            $group: {
                _id: "$name",
                totalOut: { $sum: "$quantityChange" } 
            }
        },
        {
            $sort: { totalOut: -1 } 
        },
        {
            $limit: 5 
        }
    ]);

    data.top5 = top5_data

    res.json({ message: "Query Finished", data });
};

