import { consumeMessages } from '@maorte/strategos-services-common-package/dist/utils/messaging';
import { createGameSession } from '../services/gameSessionService';

const QUEUE_NAME = 'matchmaking-session';

export const startGameSessionConsumer = async (): Promise<void> => {
  await consumeMessages(QUEUE_NAME, async (message) => {
    try {
      console.log(`Received message from queue ${QUEUE_NAME}:`, message);
      const players = message.match.map((player: { id: string }) => player.id);

      // Create a new game session using the received player IDs
      const session = createGameSession(players);
      console.log('Game session created:', session);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
};