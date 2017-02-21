/**
 * Created by graham on 07/02/17.
 */

var express = require('express');
var auth = require('../helper/auth');
var DashboardController = require('../controller/dashboard-controller');

var router = express.Router();
var controller = new DashboardController();

router.get('/', auth.checkAuth, function(req, res) {
    controller.handleInitialLoad(req, res);
});

module.exports = router;