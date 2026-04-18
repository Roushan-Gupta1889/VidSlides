/**
 * Global Error Handler Middleware
 * Catches all errors and returns structured JSON responses
 */

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Structure error response
  const response = {
    success: false,
    error: {
      message: err.message || 'Internal server error',
      type: getErrorType(statusCode),
    },
  };

  // Include stack trace in development only
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * Map status code to error type string
 */
function getErrorType(statusCode) {
  const types = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE',
  };
  return types[statusCode] || 'UNKNOWN_ERROR';
}

/**
 * Create an error with a status code
 */
function createError(message, statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

module.exports = { errorHandler, createError };
