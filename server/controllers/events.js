const { v4: uuidv4, validate: uuidValidate } = require('uuid'); //we dont need uuid
const { validateId, validateString } = require('../utils/validators');
const mongoose = require('mongoose');

const eventModel = require('../models/events');
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

  searchEvent: async (req, res, next) => {
    const { name } = req.params;
    if (validateString(name)) {
      res;
    }
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
        .then((response) => {
          const data = {
            authorUid: response.authorUid,
            uid: response.uid,
            title: response.title,
            author: response.author,
            description: response.description,
            date: response.date,
            timeStamp: response.timeStamp,
            location: response.location,
            participants: response.participants,
            already_reviewed: response.already_reviewed,
            reviews: response.reviews,
            score: response.score,
          };
          return res
            .status(200)

            .json({ message: 'we found the event', data, error: false });
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
        const reducedArray = response.reduce((accumulator, currentValue) => {
          const reducedObject = {
            uid: currentValue.uid,
            title: currentValue.title,
            author: currentValue.author,
            description: currentValue.description,
            date: currentValue.date,
            timeStamp: currentValue.timeStamp,
            location: currentValue.location,
            participants: currentValue.participants,
            already_reviewed: response.already_reviewed,
            reviews: response.reviews,
            score: response.score,
          };
          return [...accumulator, reducedObject];
        }, []);

        return res.status(200).json({
          message: 'We found events',
          data: reducedArray,
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
            console.log(response);
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
            console.log(response);
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

  reviewEvent: async (req, res, next) => {
    const { event_uid, rate, review, user } = req.body;
    if (validateId(event_uid) && validateId(user.uid)) {
      const reviewObj = {
        body: review,
        rating: rate,
        from: user,
        uid: uuidv4(),
      };
      const event = await eventModel
        .findOneAndUpdate(
          { uid: event_uid },
          {
            $push: { reviews: reviewObj, already_reviewed: [user.uid] },
          },
          { new: true, runValidators: true }
        )
        .then((response) => {
          let score = calculateScore(response.reviews);
          let data = {
            authorUid: response.authorUid,
            uid: response.uid,
            title: response.title,
            author: response.author,
            description: response.description,
            date: response.date,
            timeStamp: response.timeStamp,
            location: response.location,
            participants: response.participants,
            already_reviewed: response.already_reviewed,
            reviews: response.reviews,
            score,
          };
          return res.status(200).json({
            message: 'Review added',
            data,
            error: false,
          });
        })
        .catch((error) => {
          console.log(error);
          return res
            .status(200)
            .json({ message: 'failed attempt', error: true });
        });
    } else {
      return res.status(200).json({ message: 'failed attempt', error: true });
    }
  },
};
