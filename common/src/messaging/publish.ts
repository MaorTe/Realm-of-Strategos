import { createRabbitMQChannel, closeRabbitMQConnection } from './rabbitMQ';
import logger from '../logger/logger';

export const publishMessage = async (queue: string, message: any): Promise<void> => {
  const channel = await createRabbitMQChannel();
  await channel.assertQueue(queue);

  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    logger.info(`Message published to queue "${queue}":`, message);
  } catch (error) {
    logger.error('Error publishing message:', error);
  }

  // Optional: Close the connection after publishing if it's a one-off task
  // await closeRabbitMQConnection();
};