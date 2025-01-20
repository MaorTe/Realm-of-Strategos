import amqp, { Connection, Channel } from 'amqplib';

let connection: Connection | null = null;
let channel: Channel | null = null;

// Create or reuse a RabbitMQ connection
export const createRabbitMQConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672');
    console.log('RabbitMQ connection established');
  }
  return connection;
};

// Create or reuse a RabbitMQ channel
export const createRabbitMQChannel = async (): Promise<Channel> => {
  if (!channel) {
    const conn = await createRabbitMQConnection();
    channel = await conn.createChannel();
    console.log('RabbitMQ channel created');
  }
  return channel;
};

// Close the RabbitMQ connection
export const closeRabbitMQConnection = async (): Promise<void> => {
  if (channel) {
    await channel.close();
    console.log('RabbitMQ channel closed');
    channel = null;
  }
  if (connection) {
    await connection.close();
    console.log('RabbitMQ connection closed');
    connection = null;
  }
};