import { Router } from 'express';
import { createSession } from '../controllers/sessionController';

const router = Router();

/**
 * @swagger
 * /matchmaking/session:
 *   post:
 *     summary: Create a game session for matched players
 *     tags:
 *       - Game Sessions
 *     responses:
 *       200:
 *         description: Game session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSession'
 *       404:
 *         description: No match found
 *       500:
 *         description: Failed to create a game session
 */
router.post('/session', createSession);

export default router;