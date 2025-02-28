import { Router } from 'express';
import { JWT_SECRET, DATABASE_URL } from '../config';
import { authMiddleware, catchAsyncErrors } from '@maorte/strategos-services-common-package/dist';
import {
  createSession,
  retrieveSession,
  listSessions,
  updateSessionStatus,
  deleteSession,
} from '../controllers/gameSessionController';

const router = Router();
const authMiddlewareRef = authMiddleware(JWT_SECRET, DATABASE_URL)

/**
 * @swagger
 * /game-session/create:
 *   post:
 *     summary: Create a new game session
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Game Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGameSessionRequest'
 *     responses:
 *       201:
 *         description: Game session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSession'
 *       400:
 *         description: Invalid players array
 */
router.post('/create', authMiddlewareRef, catchAsyncErrors(createSession));

/**
 * @swagger
 * /game-session/{id}:
 *   get:
 *     summary: Retrieve details of a specific session
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Game Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSession'
 *       404:
 *         description: Session not found
 */
router.get('/:id', authMiddlewareRef, catchAsyncErrors(retrieveSession));

/**
 * @swagger
 * /game-session:
 *   get:
 *     summary: List all game sessions
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Game Sessions
 *     responses:
 *       200:
 *         description: List of all game sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameSession'
 */
router.get('/', authMiddlewareRef, catchAsyncErrors(listSessions));

/**
 * @swagger
 * /game-session/{id}/status:
 *   patch:
 *     summary: Update the status of a game session
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Game Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSessionStatusRequest'
 *     responses:
 *       200:
 *         description: Session status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Session not found
 */
router.patch('/:id/status', authMiddlewareRef, catchAsyncErrors(updateSessionStatus));

/**
 * @swagger
 * /game-session/{id}:
 *   delete:
 *     summary: Delete a game session
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Game Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the session to delete
 *     responses:
 *       204:
 *         description: Session deleted successfully
 *       404:
 *         description: Session not found
 */
router.delete('/:id', authMiddlewareRef, catchAsyncErrors(deleteSession));

export default router;