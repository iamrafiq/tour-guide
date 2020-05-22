const express = require('express');
const userController = require('./../controller/userController')

const router = express.Router();
/**PARAM middleware,
 * param-middleware only runs 
 * when there is certain types of parameter, in our case we have id parametar so 
 * we can add a param middleware
 */
router.param('id', userController.checkID);
//Users route
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  module.exports = router;