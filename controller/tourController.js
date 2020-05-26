const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //BUILDING QUERY
    //1. Filtering
    const queryObj = { ...req.query }; //Shallow/clone copy of req.query object by desctruings
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    //2. Advance filtaring
    //api call: 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5&price[lt]=1000
    //input { difficulty: 'easy', duration: { gte: '5' } }
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    queryString = JSON.parse(queryString)
    console.log(queryString);
    //out put: { difficulty: 'easy', duration: { '$gte': '5' } }
    //{ difficulty: 'easy', duration: { $gte: '5' } }
    //const tours = await Tour.find({ duration:5, difficulty:'easy'});
    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    //const tours = await Tour.find();

    const query = Tour.find(queryString);

    //EXECUTING QUERY
    const tours = await query;

    //SEND RESPONCE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    console.log(newTour);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(204).json({
      status: 'fail',
      message: err,
    });
  }
};
