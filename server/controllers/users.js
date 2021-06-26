const { v4: uuidv4, validate: uuidValidate } = require('uuid'); //we dont need uuid
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { validateId, validateString } = require('../utils/validators');
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const userModel = require('../models/users');
const { response } = require('../app');

tokenSign = (user) => {
  return JWT.sign(
    {
      iss: 'Boomerang',
      sub: user.uid,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    JWT_SECRET
  );
};

module.exports = {
  getUser: async (req, res, next) => {
    return res.status(200).json({
      message: 'User found',
      error: false,
      data: req.user,
    });
  },

  getOrgs: async (req, res, next) => {
    await userModel
      .find({"accountType": "org"})
      .then((response) => {
        return res.status(200).json({
          message: "We found the organizations",
          data: response,
          error: false
        })
      })
      .catch((error) => {
        return res.status(200).json({
          error: true, 
          message: error
        })
      })
  },
  denyOrg: async (req, res, next) => {
    const { uid } = req.params;
    await userModel.findOneAndDelete({ uid }).then((response) => {
      return res.status(200).json({
        message: "Organization has been denied",
        data: response
      })
    })
  },
  approveOrg: async(req, res, next) => {
    const { uid } = req.params;
    await userModel.findOneAndUpdate({"approved": true}).then((response) =>{
      return res.status(200).json({
        message: "Organization has been approved",
        data: response
      })
    })
  },
  getOneUser: async (req, res, next) => {
    const { uid } = req.params;
    if (validateId(uid)) {
      await userModel
        .findOne({ uid })
        .then((response) => {
          console.log(response);
          return res.status(200).json({
            message: 'we found the user',
            data: response,
            error: false,
          });
        })
        .catch((error) => {
          return res
            .status(200)
            .json({ message: 'Am prin o eroare', error: true });
        });
    } else {
      return res.status(200).json({
        message: 'No such user with the specified ID found!',
        error: true,
      });
    }
  },

  signUpUser: async (req, res, next) => {
    const { username, password, email, accountType } = req.body;
    let approved = 'user';
    if(accountType === "org") {
      approved = false
    }
    const uid = uuidv4();
    let userFound = await userModel.findOne({ username });
    if (userFound) {
      return res
        .status(200)
        .json({ message: 'user already registered', error: true });
    }

    const newUser = new userModel({
      username,
      password,
      email,
      uid,
      accountType,
      approved
    });
    await newUser.save();

    const token = tokenSign(newUser);
    return res.status(200).json({ token, message: 'all good brother' });
  },
  signInUser: async (req, res, next) => {
    if (!req.user || Object.keys(req.user).length === 0) {
      return res.status(200).json({ message: 'no user here', error: true });
    }
    if (!req.user) {
      return res.status(200).json({ message: 'no user here', error: true });
    }
    const token = tokenSign(req.user);
    return res
      .status(200)
      .json({ token, message: 'succesfull login', error: false });
  },

  deleteUser: async (req, res, next) => {
    const { uid } = req.user;
    await userModel
      .findOneAndDelete({ uid })
      .then((response) => {
        return res.status(200).json({ message: 'Delete act complete' });
      })
      .catch((error) => {
        return res.status(200).json({ message: 'failed attempt' });
      });
  },
  editUser: async (req, res, next) => {
    if (!req.user || Object.keys(req.user).length === 0) {
      return res.status(200).json({ message: 'no user here', error: true });
    }
    const { uid } = req.user;
    const { username, email, accountType } = req.body;
    let password =
      req.body &&
      req.body.password !== undefined &&
      req.body.password !== null &&
      req.body.password !== ''
        ? req.body.password
        : '';

    let editObject = {};
    if (password === '') {
      editObject = {
        username,
        email,
        uid,
      };
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      password = hash;
      editObject = {
        username,
        email,
        uid,
        password,
      };
    }
    await userModel
      .findOneAndUpdate({ uid }, editObject, {
        new: true,
        runValidators: true,
      })
      .then((respone) => {
        // const token = tokenSign(req.user)
        return res
          .status(200)

          .json({
            message: 'we found the user',
            data: { username, email, uid, accountType },
            // token
          });
      })
      .catch((error) => {
        return res.status(200).json({ message: 'failed attempt' });
      });
  },
};
