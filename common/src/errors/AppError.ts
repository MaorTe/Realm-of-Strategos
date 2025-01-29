class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
  
    constructor(message: string, statusCode: number, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      // Maintain proper stack trace (only available in V8 environments)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default AppError;