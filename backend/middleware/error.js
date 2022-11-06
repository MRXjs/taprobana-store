const ErrorHander = require("../utils/ErrorHander.js");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Wrong MongoDB Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHander(message, 400);
  }

  //Mongoose duplicate key error
  if (err.code === 11000) {
    console.log(Object.keys(err.keyValue));
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHander(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web Token is invalid try again`;
    err = new ErrorHander(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpireError") {
    const message = `Json web Token is Expire, try again`;
    err = new ErrorHander(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
