import { Request, Response } from 'express';
import { registerUser, loginUser, validateToken } from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const user = await registerUser(username, password);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, username: user.username } });
    
  } catch (error) {
    res.status(409).json({ error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const token = await loginUser(username, password);
    res.json({ token });
  } catch (error) {
    res.status(409).json({ error });
  }
};

export const validate = (req: Request, res: Response): void => {
  try {
    const { token } = req.body;
    const decoded = validateToken(token);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: error });
  }
};