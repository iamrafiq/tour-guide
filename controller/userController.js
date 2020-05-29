const APIFeatures = require('../utils/apifeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apperror');
const User = require('./../models/userModel');

exports.getAllUsers = (req, res) => {
  res.status('200').json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});
exports.getUser = (req, res) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  return res.status('500').json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
