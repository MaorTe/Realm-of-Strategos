import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

export const publishMessage = async (queue: string, message: object): Promise<void> => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue ${queue}:`, message);
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Failed to publish message:', error);
    throw error;
  }
};

export const consumeMessages = async (queue: string, callback: (msg: any) => void): Promise<void> => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    console.log(`Waiting for messages in queue: ${queue}`);
    channel.consume(queue, (msg: any) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Failed to consume messages:', error);
    throw error;
  }
};