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
    queryString = JSON.parse(queryString);
    console.log(queryString);

    //output: { difficulty: 'easy', duration: { '$gte': '5' } }
    //const tours = await Tour.find({ duration:5, difficulty:'easy'});
    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    //const tours = await Tour.find();

    let query = Tour.find(queryString);

    //3.Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    //4. Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      //comment -__V, here minus(-) means excluding __V field, so this field will not send to client
      query = query.select('-__v');
    }
    //5. Pagination
    //page=2&limit=10, 1-10 for page1 and 11-20 page2, 21 to 30 page3 ....
    //for page1:query = query.skip(0).limit(10);
    //for page2:query = query.skip(10).limit(10);
    //for page3:query = query.skip(20).limit(10);
    //and so on ...
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page dose not exist!!');
    }

    //finally query become to execute
    //query.find().sort().select().skip().limit();
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
