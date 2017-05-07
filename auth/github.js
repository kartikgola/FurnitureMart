var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var User = require('../user');
var config = require('../config');
var init = require('./init');


passport.use(new GitHubStrategy({
  clientID: config.githubAuth.clientID,
  clientSecret: config.githubAuth.clientSecret,
  callbackURL: config.githubAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

    console.log(profile);
    var searchQuery = {
      someID: profile.id
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id,
      emails : profile.emails,
      profilePic : profile.photos,
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
