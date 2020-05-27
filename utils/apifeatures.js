class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1. Filtering
    console.log('filtering: ');
    const queryObj = { ...this.queryString }; //Shallow/clone copy of req.query object by desctruings
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2. Advance filtaring
    //api call: 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5&price[lt]=1000
    //input { difficulty: 'easy', duration: { gte: '5' } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    //output: { difficulty: 'easy', duration: { '$gte': '5' } }
    //const tours = await Tour.find({ duration:5, difficulty:'easy'});
    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
    //const tours = await Tour.find();
    this.query = this.query.find(queryStr);
    return this;
    //let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    //3.Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    //4. Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //comment -__V, here minus(-) means excluding __V field, so this field will not send to client
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //5. Pagination
    //page=2&limit=10, 1-10 for page1 and 11-20 page2, 21 to 30 page3 ....
    //for page1:query = query.skip(0).limit(10);
    //for page2:query = query.skip(10).limit(10);
    //for page3:query = query.skip(20).limit(10);
    //and so on ...
    //  page = this.queryString.page * 1 means page will conting int value of this.queryString.page
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
