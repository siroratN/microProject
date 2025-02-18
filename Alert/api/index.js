require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');
const twilio = require('twilio');

const app = express();
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMSNotification(product) {
    try {
        const message = await client.messages.create({
            body: `สินค้า ${product.name} มีจำนวนเหลือเพียง ${product.quantity} ต่ำกว่าค่ากำหนด กรุณาเติมสต็อก!`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.ADMIN_PHONE_NUMBER
        });

        console.log(`SMS sent: ${message.sid}`);
    } catch (error) {
        console.error(error);
    }
}



async function consumeAlerts() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'alert_queue';

    await channel.assertQueue(queue);
    console.log("Waiting for stock alerts...");

    channel.consume(queue, async (msg) => {
        const product = JSON.parse(msg.content.toString());
        console.log("Received stock alert:", product);

        await sendSMSNotification(product);
        channel.ack(msg);
    });
}

consumeAlerts();

app.listen(4004, () => console.log("Notification Service running on port 4004"));
