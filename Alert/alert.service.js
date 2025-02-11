const amqp = require('amqplib');

async function receiveAlertMessage() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'alert_queue';

    await channel.assertQueue(queue);
    console.log('[Alert Service] Waiting for alerts...');

    channel.consume(queue, (msg) => {
        const alert = JSON.parse(msg.content.toString());
        console.log(`[Alert Service] 🚨 ALERT: ${alert.message} (Product: ${alert.name}, Remaining: ${alert.quantity})`);
    }, { noAck: true });
}

receiveAlertMessage();
