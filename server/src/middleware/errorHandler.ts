import { Request, Response, NextFunction } from 'express';

/** Central error handling middleware */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  // Do not leak internal details
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message || 'Error';
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    status
  });
  res.status(status).json({
    error: message,
    // In non-production you could include more info
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack })
  });
}
