const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 400,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    maxLength: 50,
  },
  authorUid: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: String,
    required: true,
  },
  participants: {
    type: Array,
    default: [],
  },
})

const eventModel = mongoose.model('events', eventSchema)
module.exports = eventModel
