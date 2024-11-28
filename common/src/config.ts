import * as fs from 'fs';

const authServiceUrl = fs.readFileSync('/run/secrets/AUTH_SERVICE_URL', 'utf8').trim();
const gameSessionServiceUrl = fs
   .readFileSync('/run/secrets/GAME_SESSION_SERVICE_URL', 'utf8')
   .trim();

export const config = {
   authServiceUrl: authServiceUrl || 'http://localhost:3000',
   gameSessionServiceUrl: gameSessionServiceUrl || 'http://localhost:3001',
};
