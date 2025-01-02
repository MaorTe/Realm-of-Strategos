import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3003 });

console.log('WebSocket Server running on port 3003');

export const broadcastMessage = (message: object): void => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());
  });
});