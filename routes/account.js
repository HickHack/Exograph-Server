var express = require('express');
var auth = require('../middleware/auth');

var router = express.Router();

router.get('/', auth.checkAuth, function (req, res, next) {
    res.render('home/account', {
        title: process.conf.app.NAME,
        user: req.user
    });
});

module.exports = router;