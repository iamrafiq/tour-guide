const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apifeatures');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  try {
    //BUILDING QUERY

    //finally query become to execute
    //query.find().sort().select().skip().limit();
    /***
     * new APIFeatures(Tour.find(), req.query), we are just creating a query object
     * not executing it, after adding query option like filter, sort, limitFileds, paginate
     * then we execute it by awaiting
     * await features.query;
     * But before executing this query, mongoose will execute
     * pre find Query middleware in the tourModel.js, example discarding all secretTour
     */
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //EXECUTING QUERY

    const tours = await features.query;

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
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //const tour = await Tour.findOne({ _id: req.params.id });
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  /*try {
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }*/
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
  /*try {
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }*/
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
  /*try {
  } catch (err) {
    res.status(204).json({
      status: 'fail',
      message: err,
    });
  }*/
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        //_id: null, // calculate all, works fine
        numTours: { $sum: 1 }, // 1 will be added for each documents
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 }, //  1 for assending & -1 for desending
    },
    //{ $match: { _id: { $ne: 'EASY' } } }, // Excluding EASY from previous resulst previous match group and sort, to see the effect comment this section.
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  /*try {
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }*/
});

exports.getMonnthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // converting to integer
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, // 0 means deleting this field, 1 means add this field
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12, // 12 months
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  /* try {
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }*/
});
