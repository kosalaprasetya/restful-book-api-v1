const errorHandler = (err, req, res, next) => {
  // Ambil properti default jika bukan instance AppError
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL SERVER ERROR';
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  // Log error secara detail di server
  console.error(err);

  // Kirim respons standar
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};

module.exports = errorHandler;
