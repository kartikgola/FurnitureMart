var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin');

var User = require('../user');
var config = require('../config');
var init = require('./init');

passport.use(new LinkedInStrategy({
    consumerKey: config.linkedinAuth.clientID,
    consumerSecret: config.linkedinAuth.clientSecret,
    callbackURL: config.linkedinAuth.callbackURL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
  },
  // linkedin sends back the tokens and progile info
  function(token, tokenSecret, profile, done) {

    console.log(profile);
    var searchQuery = {
      someID: profile.id
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id,
      emails : profile['email-address'],
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
