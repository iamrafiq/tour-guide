const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
