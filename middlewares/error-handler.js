const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.status && err.message) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
