import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction):any => {
  // Shared auth logic for both services
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Validate token logic...
    next();
    return res.status(200).json({ message: 'token provided' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};