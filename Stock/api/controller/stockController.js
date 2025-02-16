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

        console.log(`[Stock Service] Sent stock movement: ${ productId }`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
    }
}


const log_stock = async (req, res) => {
    const { productId,name, quantityChange, action  } = req.body;

    const stockLog = new StockLog({ productId, quantityChange, action, name });
    await stockLog.save();

    await axios.post('http://localhost:4001/api/inventory/updateStock', { productId, quantityChange, action, name });
    sendStockMovementToQueue(productId, quantityChange, action, name)

    res.json({ message: "Stock movement recorded", stockLog });
};


export default log_stock