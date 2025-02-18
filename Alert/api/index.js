require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendEmailNotification(product) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: "siroratnbs@gmail.com", 
        subject: `Stock Alert: ${product.name}`,
        text: `สินค้า ${product.name} มีจำนวนเหลือเพียง ${product.quantity} กรุณาเติมสต็อก!`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${product.name} stock is low!`);
    } catch (error) {
        console.error("Error sending email:", error);
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

        await sendEmailNotification(product);
        channel.ack(msg);
    });
}

consumeAlerts();

app.listen(4004, () => console.log("Notification Service running on port 4004"));
