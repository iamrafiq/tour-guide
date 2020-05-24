/* eslint-disable*/
exports.checkID = (req, res, next, val) =>{
   // console.log(`user id is:${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
          status: 'fail',
          message: 'Invalid ID',
        });
      }
      next();
  }

exports.getAllUsers = (req, res)=>{
    res.status('200').json({
        status:'error',
        message:'This route is not yet defined'
    });
}
exports.createUser = (req, res)=>{
    res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}
exports.getUser = (req, res)=>{
    res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}

exports.updateUser = (req, res)=>{
    res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}

exports.deleteUser = (req, res)=>{
    return res.status('500').json({
        status:'error',
        message:'This route is not yet defined'
    });
}