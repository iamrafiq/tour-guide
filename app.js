const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const tourRouter = require('./route/tourRouter');
const userRouter = require('./route/userRouter');
const app = express();
//using morgan to logging middleware
//options: combined , common , dev, short ,tiny
app.use(morgan('short'));
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

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//starting server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
