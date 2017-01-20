module.exports = function (app, passport) {

    //GET
    app.get('/register', function (req, res) {
        res.render('auth/register', {
            title: 'Exograph',
            message: req.flash('loginMessage')
        });
    });

    //POST
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));
}
