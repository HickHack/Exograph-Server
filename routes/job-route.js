var express = require('express');
var auth = require('../helper/auth');
var JobController = require('../controller/job-controller');

var router = express.Router();
var controller = new JobController();

router.get('/alert', auth.checkAuth, function(req, res, next) {
    controller.handleJobsAlert(req, res, next);
});

module.exports = router;