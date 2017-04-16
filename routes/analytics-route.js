/**
 * Created by graham on 16/04/17.
 */

var express = require('express');
var auth = require('../helper/auth');
var AnalyticsController = require('../controller/analytics-controller');

var router = express.Router();
var controller = new AnalyticsController();

router.get('/:id(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.getView(req, res);
});

router.get('/data/degree/:id(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.getDegreeDistribution(req, res);
});


module.exports = router;
