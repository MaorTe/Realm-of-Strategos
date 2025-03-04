import { Router } from 'express';
import { JWT_SECRET, DATABASE_URL } from '../config';
import { queuePlayer, findMatchAndPublish, findMatchAndNotify } from '../controllers/matchmakingController';
import { authMiddleware, catchAsyncErrors } from '@maorte/strategos-services-common-package/dist';
const router = Router();
const authMiddlewareRef = authMiddleware(JWT_SECRET, DATABASE_URL);
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
router.post('/queue', authMiddlewareRef, catchAsyncErrors(queuePlayer));

/**
 * @swagger
 * /matchmaking/match/publish:
 *   get:
 *     summary: Find a match and publish to RabbitMQ
 *     tags:
 *       - Matchmaking
 *     responses:
 *       200:
 *         description: Match found and published to RabbitMQ
 *       404:
 *         description: No match found
 *       500:
 *         description: Failed to find or publish match
 */
router.get('/match/publish', authMiddlewareRef, catchAsyncErrors(findMatchAndPublish));

/**
 * @swagger
 * /matchmaking/match/notify:
 *   get:
 *     summary: Find a match and notify clients via WebSocket
 *     tags:
 *       - Matchmaking
 *     responses:
 *       200:
 *         description: Match found and clients notified via WebSocket
 *       404:
 *         description: No match found
 *       500:
 *         description: Failed to find match or notify clients
 */
router.get('/match/notify', authMiddlewareRef, catchAsyncErrors(findMatchAndNotify));

export default router;