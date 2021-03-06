var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../user');
var config = require('../config');
var init = require('./init');

passport.use(new TwitterStrategy({
    consumerKey: config.twitterAuth.consumerKey,
    consumerSecret: config.twitterAuth.consumerSecret,
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    callbackURL: config.twitterAuth.callbackURL,
  },
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      someID: profile.id
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id,
      profilePic : profile.photos[0].value,
      emails : profile.emails[0].value,
      location : profile.location
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
init();

module.exports = passport;
