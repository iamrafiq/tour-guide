const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/apperror');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');

const app = express();
if (process.env.NODE_ENV === 'development') {
  //using morgan to logging middleware
  //options: combined , common , dev, short ,tiny
  app.use(morgan('short')); // this morgan function call next();
}
//app.use(morgan('short'));  // this morgan function call next();

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
/*
//this is a middleware function
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

//this is a middleware function
app.use(bodyParser.json()); // to support JSON-encoded bodies*/
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/** Route Exception Handeling (after declaration of all routes)
 * wrong route: route that did not exist
 * wrong id/query object: route exist but wrong id or query object supplied
 * app.all(): means all verbs/methods such as get, post, patch, update, delete
 * app.all(*): * means any route that dose not matched with previous declaration yet.
 
*/
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
/**Error Middleware
 * This is a special middleware called error middleware
 * Diffrence with other: all other middleware has three argument req,res and next
 * But error middleware has for arguments starts with err, then req, res and next
 * if we pass anythings (object or variable) from any middleware form any point of app using next funciton,
 * decleard error middleware will be called
 * example: next(error); from anywhere of the app
 *
 */

app.use(globalErrorHandler);
module.exports = app;
