var express = require('express');
var auth = require('../helper/auth');
var GraphController = require('../controller/graph-controller');

var router = express.Router();
var controller = new GraphController();

router.get('/import', auth.checkAuth, function(req, res, next) {
    controller.handleImport(req, res);
});

router.get('/view/:id', auth.checkAuth, function(req, res, next) {
    controller.handleViewPage(req, res);
});

router.get('/data/:id', auth.checkAuth, function(req, res, next) {
    controller.handleGraphLoad(req, res);
});

router.post('/import/linkedin', auth.checkAuth, function(req, res, next) {
    controller.launchLinkedinImport(req, res);
});

module.exports = router;
