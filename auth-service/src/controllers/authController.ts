import { Request, Response } from 'express';
import { registerUser, loginUser, validateToken } from '../services/authService';
import logger from '@maorte/strategos-services-common-package/dist/utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn('Missing username or password');
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    
    const user = await registerUser(username, password);
    logger.info(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username } });
    
  } catch (error) {
    logger.error('Failed to register user:', error);
    res.status(409).json({ error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      logger.warn('Missing username or password');
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const token = await loginUser(username, password);
    logger.info(`User logged in: ${username}`);
    res.status(200).json({ token, message: 'User logged in successfully' });
  } catch (error) {
    logger.error('Failed to log in user:', error);
    res.status(409).json({ error });
  }
};