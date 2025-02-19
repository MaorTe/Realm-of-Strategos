import { logger } from '../logger';

export class HttpError extends Error {
    public statusCode: number;
    public isOperational: boolean; // Differentiates between expected & unexpected errors

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name; // Assigns class name as error name

        // Preserve stack trace (for debugging)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // Log error when it's created
        logger.error(`[${this.name}] ${message} (Status: ${statusCode})`);
    }
}