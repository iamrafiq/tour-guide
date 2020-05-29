const AppError = require('./../utils/apperror');

const handleCastErrorDB = (err) => {
  const message = `Invalide ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
  /**regular expression for text between quots
   * Mongodb Error: "errmsg": "E11000 duplicate key error collection: tour-guide.tours index: name_1 dup key: { name: \"The Forest Hiker\" }",
   */
  const value = err.errmsg.match(/"([^"]*)"/);
  const message = `Duplicate field value:${value[0]}. Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    //Operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error
    //1. Log error for developer
    console.error('ErrorController: 🔥', err);
    //2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log('Error Controller', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Error Controller Inside', process.env.NODE_ENV);

    let error = { ...err }; // object cloning
    if (error.name === 'CastError') {
      /**MongoDB operational error:
       * invalid Id,
       */
      console.log('Error Controller Inside', process.env.NODE_ENV);

      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      /**
       * MongoDB operational error
       * duplicate key error collection
       */
      error = handleDuplicateFieldDB(error);
    }
    if (error.name === 'ValidationError') {
      /**
       * Mongoose operational error
       * validation error(ratings avarage( > 6 and  <1) or difficulty (!medium, !hight, !easy) )
       */
      error = handleValidationErrorDB(error);
    }
    sendErrorProd(error, res);
  }
};
