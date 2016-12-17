var express = require('express');
var router = express.Router();

/* GET login. */
router.get('/', function(req, res, next) {
    res.render('login/login', { title: 'Exograph' });
});

router.route('/').post(function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    console.log('Email: ' + email +' Password: ' + password);

    res.render('index');
});

module.exports = router;
