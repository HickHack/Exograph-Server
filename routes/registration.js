var express = require('express');
var router = express.Router();
var errors = require('../model/errors');
var User = require('../model/user');

/* GET register page. */
router.get('/', function (req, res, next) {
    res.render('registration/register', {title: 'Exograph'});
});

router.route('/').post(function (req, res) {
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var company = req.body.company;
    var country = req.body.country;
    var email = req.body.email;
    var password = req.body.password;

    /*if (firstname == '' || surname == '' || company == '' ||
        country == '' || email == '' || password == '') {
        res.render('registration/register', {error: 'Please complete all fields'});
    }*/

    User.create({
        firstname: firstname,
        surname: surname,
        company: company,
        country: country,
        email: email,
        password: password
    }, function (err, user) {
        if (err) {
            if (err instanceof errors.ValidationError) {
                // Return to the create form and show the error message.
                // TODO: Assuming username is the issue; hardcoding for that
                // being the only input right now.
                // TODO: It'd be better to use a cookie to "remember" this info,
                // e.g. using a flash session.
                return res.redirect(URL.format({
                    pathname: '/register',
                    query: {
                        username: req.body.username,
                        error: err.message,
                    },
                }));
            } else {
                return next(err);
            }
        }
        res.redirect('login');
    });
});

module.exports = router;
