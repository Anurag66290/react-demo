const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const response = require('../helpers/response');
const models = require('../models/index');
const modelName = 'Users'
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Setup options for JWT Strategy
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = jwtSecretKey;

// Create JWT Strategy
passport.use('user', new JwtStrategy(jwtOptions, 
    async function(payload, done) {
        try {
            // console.log(payload,'---payload--');
            var criteria = {
                _id: payload.data._id,
                login_time: payload.data.login_time
            }
            const existingUser = await models[modelName].findOne(criteria);
            if (existingUser) {
                return done(null, existingUser);
            }
            return done(null, false);
        } catch(e) {
            console.log('not local');
            console.log(e);
        }
    }
));

module.exports = {
    initialize: function () {
        return passport.initialize();
    },

    authenticateUser: function (req, res, next) {
        return passport.authenticate("user", {
            session: false
        }, (err, user, info) => {
            if (err) {
                return response.error(res, err);
            }
            if (info && info.hasOwnProperty('name') && info.name == 'JsonWebTokenError') {
                return response.error(res, {
					message: 'Invalid Token.'
				});
            } else if (user == false) {
                return response.error(res, {
					message: 'Authorization is required.'
				});
            }            
            // Forward user information to the next middleware
            req.user = user; 
            next();
        })(req, res, next);
    },

};
