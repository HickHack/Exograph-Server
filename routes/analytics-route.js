var express = require('express');
var auth = require('../helper/auth');
var controller = require('../controller/analytics-controller');

var router = express.Router();

router.get('/:id(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.getView(req, res);
});

router.get('/data/degree/:id(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.getDegreeData(req, res);
});

router.get('/data/location/:id(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.getLocationData(req, res);
});

module.exports = router;
