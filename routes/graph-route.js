var express = require('express');
var auth = require('../helper/auth');
var GraphController = require('../controller/graph-controller');

var router = express.Router();
var controller = new GraphController();

/**
 * Route for initial page that's loaded before a request for
 * data is sent
 */
router.get('/view/:id', auth.checkAuth, function(req, res, next) {
    controller.handleViewPage(req, res);
});

/**
 * Route for getting a graph in JSON
 */
router.get('/data/:id', auth.checkAuth, function(req, res, next) {
    controller.handleGraphLoad(req, res);
});

/**
 * Route for getting a Connection in JSON
 */
router.get('/connection/:id', auth.checkAuth, function(req, res, next) {
    controller.handleLoadConnection(req, res);
});

/**
 * Import page
 */
router.get('/import', auth.checkAuth, function(req, res, next) {
    controller.handleImport(req, res);
});

/**
 * Trigger LinkedIn Crawler
 */
router.post('/import/linkedin', auth.checkAuth, function(req, res, next) {
    controller.launchLinkedinImport(req, res);
});

router.get('/trash', auth.checkAuth, function (req, res, next) {
    controller.handleTrashView(req, res);
});

/**
 * Send or remove graph to or from trash
 */
router.patch('/trash/:id', auth.checkAuth, function (req, res, next) {
    controller.handleTrashNetwork(req, res);
});

module.exports = router;
