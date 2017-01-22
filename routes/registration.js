module.exports = function (app, passport) {

    //GET
    app.get('/register', function (req, res) {
        res.render('auth/register', {
            title: 'Exograph',
            firstname: req.session.firstname,
            surname: req.session.surname,
            company: req.session.company,
            country: req.session.country,
            email: req.session.email,
            message: req.flash('loginMessage')
        });

        delete req.session.firstname;
        delete req.session.surname;
        delete req.session.company;
        delete req.session.country;
        delete req.session.email;
    });

    //POST
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register',
        failureFlash: true
    }));
}
