import { Router } from 'express';
import {
  createSession,
  retrieveSession,
  listSessions,
  updateSessionStatus,
  deleteSession,
} from '../controllers/gameSessionController';
//import { authMiddleware } from '@maorte/strategos-services-common-package/dist/middleware/authMiddleware';

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '@maorte/strategos-services-common-package/dist/database';
import { User } from '@maorte/strategos-services-common-package/dist/models/user';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(403).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

    // Query the database for the user
    const userQuery = 'SELECT * FROM users WHERE id = $1 LIMIT 1';
    const users : User[] = await query(userQuery, [decoded.id]); // Use your query helper
    const user: User = users[0];

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Attach user and token to the request for downstream use
    (req as any).user = user;
    (req as any).token = token;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error });
  }
};


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
router.post('/create', authMiddleware, createSession);

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
router.get('/:id', retrieveSession);

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
router.get('/', listSessions);

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
router.patch('/:id/status', updateSessionStatus);

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
router.delete('/:id', deleteSession);

export default router;