import { Router } from 'express';
import { queuePlayer, getMatch } from '../controllers/matchmakingController';

const router = Router();

/**
 * @swagger
 * /matchmaking/queue:
 *   post:
 *     summary: Add a player to the matchmaking queue
 *     tags:
 *       - Matchmaking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QueueRequest'
 *     responses:
 *       200:
 *         description: Player added to the queue
 *       400:
 *         description: Invalid input. Player ID and skill are required.
 *       500:
 *         description: Failed to add player to queue.
 */
router.post('/queue', queuePlayer);

/**
 * @swagger
 * /matchmaking/match:
 *   get:
 *     summary: Find a match for players in the queue
 *     tags:
 *       - Matchmaking
 *     responses:
 *       200:
 *         description: Match found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 *       404:
 *         description: No match found
 *       500:
 *         description: Failed to find match
 */
router.get('/match', getMatch);

export default router;