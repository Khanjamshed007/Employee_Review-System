const passport = require('passport');
const User = require('../model/user');

const LocalStrategy = require('passport-local').Strategy;

// Authentication using Passport
passport.use(new LocalStrategy({
    usernameField: 'email', passReqToCallback: true //allows to set first segment req

}, function (req, email, password, done) {
    // find the user and establish the Identity
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            req.flash('error', err);
            return done(err);
        }
        if (!user || user.password != password) {
            req.flash('error', 'Invalid Email Or Password');
            return done(null, false);
        }

        return done(null, user)
    })
}));

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
    done(null, user.id)
});

// Deserializing the user from the key it the cookies

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            console.log('Error in finding the User');
            return done(err);
        }
        return done(null, user);
    });
});

// check if the user is authenticated(middleware)
passport.checkAuthentication = (req, res, next) => {
    // if the user signed in then pass on the request to the next function(Controller Action);
    console.log('Inside check authentication : ', req);
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not logged in 
    return res.redirect('/');
};

passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.user contains the current signed user  from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user
    }
    next();
};

module.exports = passport;