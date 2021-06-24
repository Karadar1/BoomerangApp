const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = require('passport-jwt').Strategy

const userModel = require('./models/users')
const { JWT_SECRET } = require('./config/index')

module.exports = passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await userModel.findOne({ email })
      if (!user) {
        return done(null, {})
      }
      const passwordMatch = await user.validatePassword(password)
      if (!passwordMatch) {
        return done(null, {})
      }
      return done(null, user)
    }
  )
)
