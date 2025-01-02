import { Player } from './player';

export interface GameSession {
  sessionId: string;
  players: Player[];
  createdAt: Date;
}