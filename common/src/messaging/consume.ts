import { createRabbitMQChannel, closeRabbitMQConnection } from "./rabbitMQ";
import logger from "../logger/logger";

export const consumeMessages = async (queue: string, onMessage: (msg: any) => void): Promise<void> => {
  const channel = await createRabbitMQChannel();
  await channel.assertQueue(queue);

  channel.consume(queue, (msg) => {
    if (msg) {
      try {
        const messageContent = JSON.parse(msg.content.toString());
        onMessage(messageContent);
        channel.ack(msg);
      } catch (error) {
        logger.error("Error processing message:", error);
        channel.nack(msg, false, false); // Reject message without requeueing
      }
    }
  });

  process.on("SIGINT", async () => {
    logger.info("Closing RabbitMQ connection due to SIGINT");
    await closeRabbitMQConnection();
    process.exit(0);
  });
};
