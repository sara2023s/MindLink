import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.code === 'auth/email-already-in-use') {
    return res.status(400).json({
      message: 'Email is already in use'
    });
  }

  if (err.code === 'auth/invalid-email') {
    return res.status(400).json({
      message: 'Invalid email address'
    });
  }

  if (err.code === 'auth/weak-password') {
    return res.status(400).json({
      message: 'Password is too weak'
    });
  }

  if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
    return res.status(401).json({
      message: 'Invalid email or password'
    });
  }

  // Handle Firestore errors
  if (err.code?.startsWith('firestore/')) {
    return res.status(500).json({
      message: 'Database error occurred'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      details: err.message
    });
  }

  // Handle unauthorized errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized access'
    });
  }

  // Handle not found errors
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      message: 'Resource not found'
    });
  }

  // Default error response
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 