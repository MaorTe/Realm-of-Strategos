import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn('Missing username or password');
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    
    const user = await registerUser(username, password);
    logger.info(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn('Missing username or password');
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const token = await loginUser(username, password);
    logger.info(`User logged in: ${username}`);
    res.status(200).json({ token, message: 'User logged in successfully' });
};