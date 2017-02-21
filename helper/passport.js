var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user-model');
var errors = require('../helper/errors');

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
            if (err) return done(err);

            done(null, user);
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
        var firstname = req.body.firstname;
        var surname = req.body.surname;
        var company = req.body.company;
        var country = req.body.country;

            process.nextTick(function () {
                //Check if email exists
                User.getBy('user.email', email, function (err, existingUser) {
                    if (err) return done(err);

                    if(req.user) {
                        // TODO: Handle already logged in
                    } else {
                        User.create({
                            firstname: firstname,
                            surname: surname,
                            company: company,
                            country: country,
                            email: email,
                            password: password
                        }, function (err, user) {
                            if (err && err instanceof errors.ValidationError) {

                                // Used to reset form values
                                // Not the best solution, could use
                                // a message broker instead
                                req.session.firstname = firstname;
                                req.session.surname = surname;
                                req.session.company = company;
                                req.session.country = country;
                                req.session.email = email;

                                return done(null, false, req.flash(
                                    'loginMessage', err.message
                                ));
                            }

                            return done(null, user);
                        });
                    }
            })
        });
    }));

};