import { HttpError } from "../middleware/HttpError";
import { Request, Response, NextFunction } from "express";
import { logger } from '../logger';

/**
 * Wraps async route handlers to catch errors and forward them to Express's error middleware.
 */
export const catchAsyncErrors = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next); // Forward errors to `errorHandler.ts`
    };
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const isHttpError = err instanceof HttpError;
    const statusCode = isHttpError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    // Log unexpected errors separately
    if (!isHttpError || !err.isOperational) {
        logger.error(`[SYSTEM ERROR] ${statusCode} ${err.stack}`);
    }

    res.status(statusCode).json({
        success: false,
        message: (isHttpError && err.isOperational) ? message : "Something went wrong",
    });
};