var passport = require('passport')
var User = require('../models/user');
var UniqueTokenStrategy = require('passport-unique-token').Strategy;

passport.use(new UniqueTokenStrategy(
	function (token, done) {
		User.findOne({ uniqueToken: token, expireToken: { $gt: Date.now() } }, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		});
    })
);

function authenticate(req, res, next) {
    passport.authenticate('token', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            res.status(401).json({message: "Incorrect token credentials"});
        }

        req.user = user;
        next();
    });
}

module.exports = authenticate;