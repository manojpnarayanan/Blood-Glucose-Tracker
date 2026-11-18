function errorHandler(err, req, res, next) {
  console.error('[Error]:', err.message);

  const statusCode = err.statusCode || 400;
  res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred.',
  });
}

module.exports = errorHandler;