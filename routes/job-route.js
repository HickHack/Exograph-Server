var express = require('express');
var auth = require('../helper/auth');
var controller = require('../controller/job-controller');

var router = express.Router();


router.get('/alert', auth.checkAuth, function(req, res, next) {
    controller.getJobsAlert(req, res, next);
});

router.get('/:id(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.getJob(req, res, next);
});

router.get('/all', auth.checkAuth, function(req, res, next) {
    controller.getJobsView(req, res, next);
});

router.get('/page/:pageNum(\\d+)', auth.checkAuth, function(req, res, next) {
    controller.paginateJobs(req, res, next);
});

module.exports = router;
