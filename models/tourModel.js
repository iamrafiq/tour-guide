const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscournt: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  }
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);
tourSchema.set('toJSON', { virtuals: true });
tourSchema.set('toObject', { virtuals: true });

/**
 * https://mongoosejs.com/docs/guide.html#toJSON
 *
 * If you use toJSON() or toObject() mongoose will not include virtuals by default.
 * This includes the output of calling JSON.stringify() on a Mongoose document,
 *  because JSON.stringify() calls toJSON(). Pass { virtuals: true } to either toObject() or toJSON().
 */

// virtual properties

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
const Tour = mongoose.model('Tour', tourSchema);
/**
 * new toure can be creatable from Tour model
 * const testTour = new Tour({name: 'Rafiq Rafiq',});console.log(testTour.name);
 * also this tour can save in database by using save function prototype of model class,
 * save function return Pormise, which need to consume by using then
 * testTour.save().then(doc=>console.log(doc);).catch(err=>{}) // here doc is resolved value return by the Promise, which is final value that saved in database
 *
 */

module.exports = Tour;
