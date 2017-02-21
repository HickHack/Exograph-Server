var auth = require('../helper/auth');

module.exports = function (app, passport) {

    //GET Login
    app.get('/login', function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        }

        res.render('auth/login', {
            title: process.conf.app.NAME,
            message: req.flash('loginMessage'),
            email: req.session.emailField
        });

        delete req.session.emailField
    });

    //POST
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // GET Logout
    app.get('/logout', function (req, res, next) {
        auth.logout(req, res);
    });
}