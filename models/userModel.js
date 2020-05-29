const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    minlength: 8,
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
userSchema.pre('save', async function (next) {
  /**Encrypt password, only for new user or  updating password of the user
   * if !isModified('password') means if password has not been modified then retun and call the next() middleware
   * else hash / encrypt the passowrd by  Bcrypt to avoid  Brute-force attack
   *
   * We will save encrypted password, so no need to save confirmPassword in database
   * but  passwordConasyncfirm is a field in model, to tell database that we will not store it is to set the confirmPassword = undefine
   * but passwordConfirm is requierd-ok which means that it should be given by user to model
   * it dose not mean it's required to actually be persisted
   */
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  console.log(this.password);
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
