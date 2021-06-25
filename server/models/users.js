const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const events = require('./events.js');

const userSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    minLenght: 3,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLenght: 8,
  },
  accountType: {
    type: String,
    required: true,
  },
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: 'events',
    },
  ],

  iterests: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.validatePassword = async function (userPassword) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
