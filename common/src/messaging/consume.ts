import { createRabbitMQChannel, closeRabbitMQConnection } from './rabbitMQ';

export const consumeMessages = async (
  queue: string,
  onMessage: (msg: any) => void
): Promise<void> => {
  const channel = await createRabbitMQChannel();
  await channel.assertQueue(queue);

  channel.consume(queue, (msg) => {
    if (msg) {
      try {
        const messageContent = JSON.parse(msg.content.toString());
        onMessage(messageContent);
        channel.ack(msg);
      } catch (error) {
        console.error('Error processing message:', error);
        channel.nack(msg, false, false); // Reject message without requeueing
      }
    }
  });

  process.on('SIGINT', async () => {
    console.log('Closing RabbitMQ connection due to SIGINT');
    await closeRabbitMQConnection();
    process.exit(0);
  });
};