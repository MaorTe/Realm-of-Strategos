import { Router } from 'express';
import {
  createSession,
  retrieveSession,
  listSessions,
  updateSessionStatus,
  deleteSession,
} from '../controllers/gameSessionController';
import { authMiddleware, catchAsyncErrors } from '@maorte/strategos-services-common-package/dist/middleware';

const router = Router();

/**
 * @swagger
 * /game-session/create:
 *   post:
 *     summary: Create a new game session
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
router.post('/create', authMiddleware, catchAsyncErrors(createSession));

/**
 * @swagger
 * /game-session/{id}:
 *   get:
 *     summary: Retrieve details of a specific session
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
router.get('/:id', authMiddleware, catchAsyncErrors(retrieveSession));

/**
 * @swagger
 * /game-session:
 *   get:
 *     summary: List all game sessions
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
router.get('/', authMiddleware, catchAsyncErrors(listSessions));

/**
 * @swagger
 * /game-session/{id}/status:
 *   patch:
 *     summary: Update the status of a game session
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
router.patch('/:id/status', authMiddleware, catchAsyncErrors(updateSessionStatus));

/**
 * @swagger
 * /game-session/{id}:
 *   delete:
 *     summary: Delete a game session
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
router.delete('/:id', authMiddleware, catchAsyncErrors(deleteSession));

export default router;