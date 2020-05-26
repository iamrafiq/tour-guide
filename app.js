const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');

const app = express();
if (process.env.NODE_ENV === 'development') {
  //using morgan to logging middleware
  //options: combined , common , dev, short ,tiny
  app.use(morgan('short')); // this morgan function call next();
}
//app.use(morgan('short'));  // this morgan function call next();

//creating our own middleware function
app.use((req, res, next) => {
  // console.log(req);
  console.log('hello from the middleware');
  next(); // next is function provided by express, if I do not call next middleware pipline will broke.
});

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

module.exports = app;
