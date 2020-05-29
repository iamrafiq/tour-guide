const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [20, 'A user name must have less or equal then 20 characters'], //woks only for strings
    minlength: [3, 'A user name must have more or equal then 3 characters'], // works only for strings
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'], // problem also return false for spaces
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength:8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password confirm can not be empty.'],
    validate: {
      /** This only works on SAVE,
       * when update user use one create save not other method 
       *  such as findByIdAndUpdate, find one and update
       */
      validator: function (v) {
        return v === this.password; // if true then valid input, if false then invalid input
      },
      message: (props) => `Passwords are not same.`,
    },
  },
});
/**pre('save') middleware
 * In between getting and saving the data in database: just right before saving data in databasse.
 */
userSchema.pre('save',function(next){
  /**Encrypt password, only for new user or  updating password of the user
   * if isModified('password')===true then retun and call the next() middleware
   * else hash / encrypt the passowrd by  Bcrypt to avoid  Brute-force attack
   */
  if(this.isModified('password')){
    return next();
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;
