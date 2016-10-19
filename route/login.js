var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('auth/login', {title: 'Express Login'});
});

router.route('/').post(function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    console.log('Email: ' + email +' Password: ' + password);

    res.render('index');
});

module.exports = router;