var express = require('express');
var auth = require('../middleware/auth');

var router = express.Router();

router.get('/', auth.checkAuth, function(req, res, next) {
    res.render('graph/graph', { title: process.conf.app.NAME });
});

module.exports = router;
