const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy

const userModel = require('./models/users')
const { JWT_SECRET } = require('./config/index')

const { ExtractJwt } = require('passport-jwt')

module.exports = passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findOne({ uid: payload.sub })
        if (!user) {
          return done(null, {})
        }
        return done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)
