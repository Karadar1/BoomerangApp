const { v4: uuidv4, validate: uuidValidate } = require('uuid'); //we dont need uuid
const { validateId, validateString } = require('../utils/validators');

const mongoose = require('mongoose');

const {
  eventModel,
  subprojectsModel,
  tasksModel,
} = require('../models/events');

const userModel = require('../models/users');
const { response } = require('../app');

module.exports = {
  // TODO add id from jwt
  addEvent: async (req, res, next) => {
    const uid = uuidv4();
    let { title, description, date, timeStamp, location } = req.body;
    const author = req.user.username;
    const authorUid = req.user.uid;
    if (!validateString(title)) {
      title = '';
    }
    if (!validateString(description)) {
      description = '';
    }
    if (!validateString(location)) {
      location = '';
    }
    const newEvent = new eventModel({
      uid,
      title,
      description,
      author,
      authorUid,
      date,
      timeStamp,
      location,
    });
    await newEvent
      .save()
      .then((response) => {
        return res.status(200).json({ message: 'Registration complete' });
      })
      .catch((error) => {
        return res
          .status(200)
          .json({ message: 'failed attempt', errorMessage: error });
      });
  },

  deleteEvent: async (req, res, next) => {
    const { uid } = req.params;
    if (validateId(uid)) {
      await eventModel
        .findOneAndDelete({ uid })
        .then((response) => {
          return res
            .status(200)
            .json({ message: 'Delete act complete', error: false });
        })
        .catch((error) => {
          return res
            .status(200)
            .json({ message: 'failed attempt', error: true });
        });
    } else return res.status(200).json({ message: 'invalid id', error: true });
  },

  getEvent: async (req, res, next) => {
    const { uid } = req.params;
    if (validateId(uid)) {
      await eventModel
        .findOne({ uid })
        .populate({
          path: 'subprojects',
          populate: {
            path: 'tasks',
            model: 'tasks',
          },
        })
        .populate('tasks')
        .then((response) => {
          // const data = {
          //   participants: participants,
          //   subprojects: subprojects,
          //   tasks: tasks,
          //   uid: uid,
          //   alreadyReviewed: already_reviewed,
          //   reviews: reviews,
          //   title: title,
          //   description: description,
          //   author: author,
          //   authorUid: authorUid,
          //   date: date,
          //   timeStamp: timeStamp,
          //   location: location,
          // };
          return res
            .status(200)

            .json({ message: 'we found the event', response, error: false });
        })
        .catch((error) => {
          return res
            .status(200)
            .json({ message: 'failed attempt', error: true });
        });
    } else {
      return res.status(200).json({
        message: 'No such event with the specified ID found!',
        error: true,
      });
    }
  },
  getEvents: async (req, res, next) => {

    const { count, offset } = req.params;
    let eventsInDatabase;
    await eventModel.countDocuments({}, (err, c) => {
      eventsInDatabase = c;
    });
      await eventModel
      .find({})
      .limit(parseInt(count))
      .skip(parseInt(offset))
      .then((response) => {


        return res.status(200).json({
          message: 'serving all events',
          data: response,
          error: false,
          eventsInDatabase,
        });
      })
      .catch((error) => {
        return res.status(200).json({ message: 'failed attempt', error: true });
      });
   

  },

  editEvent: async (req, res, next) => {
    const { uid } = req.params;
    let { description, title } = req.body;
    if (!validateString(title)) {
      title = '';
    }
    if (!validateString(description)) {
      description = '';
    }
    if (validateId(uid)) {
      if (description == '') {
        await eventModel
          .findOneAndUpdate(
            { uid },
            { title },
            { new: true, runValidators: true }
          )
          .then((response) => {
            return res
              .status(200)

              .json({ message: 'we found the event', data: response });
          })
          .catch((error) => {
            return res.status(200).json({ message: 'failed attempt' });
          });
      } else if (title == '') {
        await eventModel
          .findOneAndUpdate(
            { uid },
            { description },
            { new: true, runValidators: true }
          )
          .then((response) => {
            return res
              .status(200)

              .json({ message: 'we found the event', data: response });
          })
          .catch((error) => {
            return res.status(200).json({ message: 'failed attempt' });
          });
      } else {
        await eventModel
          .findOneAndUpdate(
            { uid },
            { description, title },
            { new: true, runValidators: true }
          )
          .then((response) => {
            return res
              .status(200)

              .json({ message: 'we found the event', data: response });
          })
          .catch((error) => {
            return res.status(200).json({ message: 'failed attempt' });
          });
      }
    } else {
      return res.status(200).json({ message: 'invalid id' });
    }
  },
  participateEvent: async (req, res, next) => {
    const { uid } = req.params;
    const participant = {
      username: req.user.username,
      uid: req.user.uid,
    };
    let { participate } = req.body;
    if (participate === undefined || participant === null) participate = true;

    if (validateId(uid)) {
      if (participate) {
        await eventModel
          .findOneAndUpdate(
            { uid },
            { $push: { participants: [participant] } },
            { new: true }
          )
          .then((response) => {
            return res
              .status(200)

              .json({
                message: 'we found the event',
                data: response,
                error: false,
              });
          })
          .catch((error) => {
            return res
              .status(200)
              .json({ message: 'failed attempt', error: true });
          });
      } else {
        await eventModel
          .findOneAndUpdate(
            { uid },
            { $pull: { participants: { $in: [participant] } } },
            { new: true }
          )
          .then((response) => {
            return res
              .status(200)

              .json({
                message: 'we found the event',
                data: response,
                error: false,
              });
          })
          .catch((error) => {
            return res
              .status(200)
              .json({ message: 'failed attempt', error: true });
          });
      }
    }
  },
  addSubevent: async (req, res, next) => {
    const { event_uid } = req.params;
    const uid = uuidv4();
    let { title, description, date, timeStamp, location } = req.body;
    const author = req.user.username;
    const authorUid = req.user.uid;

    subprojectsModel
      .create({
        uid,
        title,
        description,
        author,
        authorUid,
        date,
        timeStamp,
        location,
      })
      .then(function (subproject) {
        eventModel
          .findOneAndUpdate(
            { uid: event_uid },
            { $push: { subprojects: subproject } }
          )
          .then((response) => {
            if (response) {
              return res
                .status(200)
                .json({ error: false, message: 'subevent created.' });
            } else {
              return res
                .status(200)
                .json({ error: true, message: 'an unknown erorr occured  .' });
            }
          });
      });
  },
  addTask: async (req, res, next) => {
    const { event_uid } = req.params;
    const uid = uuidv4();
    let { title, description, date, timeStamp, location } = req.body;
    const author = req.user.username;
    const authorUid = req.user.uid;

    tasksModel
      .create({
        uid,
        title,
        description,
        author,
        authorUid,
        date,
        timeStamp,
        location,
      })
      .then(function (task) {
        eventModel
          .findOneAndUpdate({ uid: event_uid }, { $push: { tasks: task } })
          .then((response) => {
            if (!response) {
              subprojectsModel
                .findOneAndUpdate(
                  { uid: event_uid },
                  { $push: { tasks: task } }
                )
                .then((response) => {
                  return res
                    .status(200)
                    .json({ error: false, message: 'task added' });
                });
            } else {
              return res
                .status(200)
                .json({ error: false, message: 'task added' });
            }
          });
      });
  },
  endTask: async (req, res, next) => {
    const {event_uid} = req.params;
    tasksModel.findOneAndUpdate({uid: event_uid}, {"taskStatus": "done"}).then((response) => {
      return res.status(200).json({error: false, message: 'Task ended!'})
    }).catch((error) => {
      return res.status(200).json({error: true, message: error})
    })
  },
  //TODO FIX THIS HACKY MESS
  participateTask: async (req, res, next) => {
    
    const {event_uid} = req.params;
    let { participate } = req.body;
    if (participate === undefined) {
      participate = true;
    } else {
      participate = false;
    }
    console.log(participate);

    if (validateId(event_uid)) {
      if (participate) {
        await tasksModel
          .findOneAndUpdate(
            { uid: event_uid },
            { $push: { participants: req.user._id } },
            { new: true }
          )
          .then((response) => {
            userModel.
            findOneAndUpdate(
              {"uid": req.user.uid},
              {$push: {tasks: response}}
            ).then((repspnse) => {
              console.log(response)
            })
            return res
              .status(200)

              .json({
                message: 'Not validated // we found the task',
                data: response,
                error: false,
              });
          })
          .catch((error) => {
            return res
              .status(200)
              .json({ message: 'failed attempt', error: true });
          });

      } else {
        await tasksModel
          .findOneAndUpdate(
            { uid: event_uid },
            { $pull: { participants: { $in: [req.user._id] } } },
            { new: true }
          )
          .then((response) => {
            userModel.
            findOneAndUpdate(
              {"uid": req.user.uid},
              {$pull: {tasks: {$in: [response] }}}
            ).then((repspnse) => {
              console.log("BRUH BRU2H", response)
            })
            return res
              .status(200)

              .json({
                message: 'we found the event',
                data: response,
                error: false,
              });
          })
          .catch((error) => {
            return res
              .status(200)
              .json({ message: 'failed attempt', error: true });
          });
      }
    }
  },
  participateSubevent: async (req, res, next) => {
    
    const {event_uid} = req.params;
    let { participate } = req.body;
    if (participate === undefined) {
      participate = true;
    } else {
      participate = false;
    }
    console.log(participate);

    if (validateId(event_uid)) {
      if (participate) {
        await subprojectsModel
          .findOneAndUpdate(
            { uid: event_uid },
            { $push: { participants: req.user._id } },
            { new: true }
          )
          .then((response) => {
            userModel.
            findOneAndUpdate(
              {"uid": req.user.uid},
              {$push: {subprojects: response}}
            ).then((repspnse) => {
              console.log(response)
            })
            return res
              .status(200)

              .json({
                message: 'Not validated // we found the task',
                data: response,
                error: false,
              });
          })
          .catch((error) => {
            return res
              .status(200)
              .json({ message: 'failed attempt', error: true });
          });

      } else {
        await subprojectsModel
          .findOneAndUpdate(
            { uid: event_uid },
            { $pull: { participants: { $in: [req.user._id] } } },
            { new: true }
          )
          .then((response) => {
            userModel.
            findOneAndUpdate(
              {"uid": req.user.uid},
              {$pull: {subprojects: {$in: [response] }}}
            ).then((repspnse) => {
              console.log("BRUH BRU2H", response)
            })
            return res
              .status(200)

              .json({
                message: 'we found the event',
                data: response,
                error: false,
              });
          })
          .catch((error) => {
            return res
              .status(200)
              .json({ message: 'failed attempt', error: true });
          });
      }
    }
  }
  
};
