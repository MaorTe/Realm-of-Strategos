import { createRabbitMQChannel, closeRabbitMQConnection } from './rabbitMQ';

export const publishMessage = async (queue: string, message: any): Promise<void> => {
  const channel = await createRabbitMQChannel();
  await channel.assertQueue(queue);

  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message published to queue "${queue}":`, message);
  } catch (error) {
    console.error('Error publishing message:', error);
  }

  // Optional: Close the connection after publishing if it's a one-off task
  // await closeRabbitMQConnection();
};