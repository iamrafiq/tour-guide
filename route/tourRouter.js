const express = require('express');
const tourController = require('./../controller/tourController')

const router = express.Router();

/**
 * app.get('/api/v1/tours', getAllTours);
 * app.post('/api/v1/tours', createTour);
 * in one call below
 */
router.route('/').get(tourController.getAllTours).post(tourController.createTour);

/**
 * app.get('/api/v1/tours/:id', getTour);
 * app.patch('/api/v1/tours/:id', updateTour);
 * app.delete('/api/v1/tours/:id', deleteTour)
 *
 * in one call all three below
 */
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;