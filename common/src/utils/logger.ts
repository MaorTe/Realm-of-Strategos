// common/src/utils/logger.ts
import { createLogger, format, transports } from 'winston';

// Define custom log format
const customFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default log level
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Capture stack traces for errors
    customFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/app.log', level: 'info' }), // Log to file
  ],
});

// Export logger
export default logger;