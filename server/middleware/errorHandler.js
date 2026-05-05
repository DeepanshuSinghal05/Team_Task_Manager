const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    errors: err.errors || [],
  });
};

module.exports = errorHandler;
