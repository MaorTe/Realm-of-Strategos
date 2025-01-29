import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';
import logger from '../logger/logger';

const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  // Log the error details
  logger.error('Error occurred:', { message: err.message, stack: err.stack });

  // Handle operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    // Handle unexpected errors
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
  }

  next(); // Optional, depending on your setup
};

export default errorMiddleware;