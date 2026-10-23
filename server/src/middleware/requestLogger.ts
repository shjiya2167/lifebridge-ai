import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/** Middleware to attach a unique request ID and simple structured logging */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = req.headers['x-request-id']?.toString() || uuidv4();
  // Attach to request for downstream use
  (req as any).requestId = requestId;
  // Set response header so client can see it
  res.setHeader('X-Request-ID', requestId);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
    // Simple console.log; in production replace with proper logger (pino, winston, etc.)
    console.log(JSON.stringify(log));
  });
  next();
}
