import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { query } from '../database';

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