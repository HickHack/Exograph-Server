var express = require('express');
var auth = require('../helper/auth');
var SearchController = require('../controller/search-controller');

var router = express.Router();

router.get('/', auth.checkAuth, function (req, res, next) {
    controller.getAccount(req, res, next);
});

module.exports = router;