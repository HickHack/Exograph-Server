var express = require('express');
var auth = require('../helper/auth');
var controller = require('../controller/search-controller');

var router = express.Router();

router.get('/', auth.checkAuth, function (req, res, next) {
    controller.performSearch(req, res, next);
});

module.exports = router;