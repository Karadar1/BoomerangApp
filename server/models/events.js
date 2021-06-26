const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subProjectSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxLength: 400
  },
  author: {
    type: String,
    required: true
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
    required: true
  },
  date: {
    type: String,
    required: true
  },
  timeStamp: {
    type: String,
    required: true
  },
  participants: {
    type: Array,
    default: [],
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "tasks"
  }]
});

const tasksSchema = new Schema({
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
  taskStatus: {
    type: String,
    required: true,
    default: "active"
  }
});

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
  subprojects: [{
    type: Schema.Types.ObjectId,
    ref: "subprojects"
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "tasks"
  }]
})
const subprojectsModel = mongoose.model('subprojects', subProjectSchema)
const tasksModel = mongoose.model('tasks', tasksSchema)
const eventModel = mongoose.model('events', eventSchema)
module.exports = { eventModel, subprojectsModel, tasksModel }
