var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

module.exports = function (passport) {
    /**
     * Session setup, passport needs to serialise
     * and deserialize users from session
     */

    //Serialise user from session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //Deserialize a user
    passport.deserializeUser(function (id, done) {
        User.get(id, function (err, user) {
            if (err) return next(err);
            done(err, user);
        });
    });

    /**
     * Local Login Strategy
     */
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        process.nextTick(function () {
            User.getBy('user.email', email, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, req.flash(
                        'loginMessage', 'No account found'
                    ));
                }

                if (!User.isPasswordValid(password, user.password)) {
                    //Store email to reset form
                    req.session.emailField = email

                    return done(null, false, req.flash(
                        'loginMessage', 'Incorrect Password'
                    ));
                } else {
                    //Login success
                    return done(null, user);
                }
            })
        });
    }));

    /**
     * Local sign up configuration
     */
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function (req, email, password, done) {

            process.nextTick(function () {
                //Check if email exists
                User.getBy('user.email', email, function (err, existingUser) {
                    if (err) return done(err);

                    if (existingUser) {
                        return done(null, false, req.flash(
                            'loginMessage', email + ' already exists'
                        ));
                    }

                    if(req.user) {
                        // TODO: Handle already logged in
                    } else {
                        User.create({
                            firstname: req.body.firstname,
                            surname: req.body.surname,
                            company: req.body.company,
                            country: req.body.country,
                            email: email,
                            password: password
                        }, function (err, user) {
                            //TODO: Check validation errors and return message
                            if (err) { return next(err); }

                            return done(null, user);
                        });
                    }
            })
        });
    }));

};