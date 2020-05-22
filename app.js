const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

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

//this is a middleware function
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

//this is a middleware function
app.use(bodyParser.json()); // to support JSON-encoded bodies

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1; // mulltiply by 1 will convert the string to int
  const tour = tours.find((el) => el.id === id);
  //if(id>tours.length){
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};
const createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
 res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res)=>{
    res.status('200').json({
        status:'error',
        message:'This route is not yet defined'
    });
}
const createUser = (req, res)=>{
    res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}
const getUser = (req, res)=>{
    res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}

const updateUser = (req, res)=>{
    res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}

const deleteUser = (req, res)=>{
    return res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}

/**
 * app.get('/api/v1/tours', getAllTours);
 * app.post('/api/v1/tours', createTour);
 * in one call below
 */
app.route('/api/v1/tours').get(getAllTours).post(createTour);

/**
 * app.get('/api/v1/tours/:id', getTour);
 * app.patch('/api/v1/tours/:id', updateTour);
 * app.delete('/api/v1/tours/:id', deleteTour)
 *
 * in one call all three below
 */
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//Users route
app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
//starting server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
