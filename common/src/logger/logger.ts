import { createLogger, format, transports } from 'winston';

// Define custom log format
const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new transports.Console(), // Console logging
    new transports.File({ filename: 'logs/app.log', level: 'info' }) // File logging
  ],
});

export default logger;