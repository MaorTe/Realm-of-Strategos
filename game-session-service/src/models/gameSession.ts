export interface GameSession {
    id: string; // Unique identifier for the session
    players: string[]; // List of player IDs in the session
    status: 'waiting' | 'active' | 'completed'; // Session status
    createdAt: Date; // Timestamp of creation
  }