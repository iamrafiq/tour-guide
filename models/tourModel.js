const mongoose = require('mongoose');
const slugify = require('slugify');

const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'], //woks only for strings
      minlength: [10, 'A tour name must have more or equal then 10 characters'], // works only for strings
      //validate: [validator.isAlpha, 'Tour name must only contain characters'], // problem also return false for spaces
    },
    slug: String,
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
      enum: {
        // works only for string
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty level is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], // works for number and dates
      max: [5, 'Rating must be below 5.0'], // works for number and dates
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (v) {
          return v < this.price; // if true then valid input, if false then invalid input
        },
        message: (props) =>
          `Discount price ${props.value} should be below regular price!`,
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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
/**
 * Document middleware: runs before .save() and .create(), will not tiggre for .insertMany()
 * https://mongoosejs.com/docs/middleware.html
 */

tourSchema.pre('save', function (next) {
  //here this represent document , because it's document middleware
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.pre('save', function (next) {
  //here this represent document , because it's document middleware
  console.log('Will save documents');
  next();
});
tourSchema.post('save', function (doc, next) {
  //here this represent document , because it's document middleware
  // console.log(doc);
  console.log('document post middleware');
  next();
});

//Query Middlewre
/*
tourSchema.pre('find', function (next) {
  //here this represent query object , because it's query middleware
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('findOne', function (next) {
  //this middleware will work for query findById/ findOne, ref: tourContorller getTour
  //here this represent query object , because it's query middleware
  this.find({ secretTour: { $ne: true } });
  next();
});*/
/**with regular expresson for all start with find
 * findById
 * findOne
 * findByIdAndDelete
 * findByIdAndRemove
 * ...
 * All query string start with find, sing reqular expresson
 * https://mongoosejs.com/docs/middleware.html
 */
tourSchema.pre(/^find/, function (next) {
  //here this represent query object , because it's query middleware
  this.find({ secretTour: { $ne: true } });
  //Let's find how much time takes this query by using both pre and post query middleware
  //assinging a new property to this query object;
  this.start = Date.now();
  next();
});
/**
 * post query middleware will run after the query executed
 */
tourSchema.post(/^find/, function (docs, next) {
  //here this represent query object , because it's query middleware
  //query allready finished at this point
  console.log(`Query took ${Date.now() - this.start} milis`);
  // console.log(docs);
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  //this represent current aggregate object that is processing
  //unshift() is javascript function which add elements at the begening of the array

  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //console.log(this.pipeline());

  next();
});
tourSchema.post('aggregate', function (next) {
  //this represent current aggregate object that is processing
  //unshift() is javascript function which add elements at the begening of the array
  console.log('Aggregation post hook/middleware');
  //next();
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
