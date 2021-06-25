//dependencies
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

//localStuff
const eventsController = require('./controllers/events')
const usersController = require('./controllers/users')
const { mongoConnection, dataBaseName } = require('./config')
const passportLocalConfing = require('./passport-local')
const passportJwtConfig = require('./passport-jwt')
//conetions
mongoose.Promise = global.Promise
mongoose.connect(`${mongoConnection}/${dataBaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

const app = express()
app.use(cors())
//trying to import the passport
app.use(passport.initialize())

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())

//USERS API

//middleware for passport strategy

const passportLocalValidator = passport.authenticate('local', {
  session: false,
})
const passportJwtValidator = passport.authenticate('jwt', {
  session: false,
})

//path to signin for user
app.post('/user/signin', passportLocalValidator, usersController.signInUser)
//path to add new user to DB
app.post('/user/signup', usersController.signUpUser)

app.post('/user/edit', passportJwtValidator, usersController.editUser)

app.delete('/user/delete', passportJwtValidator, usersController.deleteUser)

app.get('/user/get', passportJwtValidator, usersController.getUser)
//EVENTS API

//creating a new event
app.post('/events/add', passportJwtValidator, eventsController.addEvent)
//deleting an event
app.delete('/events/delete/:uid', passportJwtValidator, eventsController.deleteEvent)
//get an event by id(if no its passed return all)
app.get('/events/get/:uid?', passportJwtValidator, eventsController.getEvent)

app.get('/events/all/:count/:offset', passportJwtValidator, eventsController.getEvents)
//this will update a specific event
app.post('/events/edit/:uid', passportJwtValidator, eventsController.editEvent)
//partipate to an event
app.post('/events/participate/:uid', passportJwtValidator, eventsController.participateEvent)

app.post('/subevents/add/:uid', passportJwtValidator, eventsController.addSubevent)

module.exports = app
