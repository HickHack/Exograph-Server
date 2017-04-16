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
    controller.getViewPage(req, res);
});

/**
 * Route for getting a graph in JSON
 */
router.get('/data/:id', auth.checkAuth, function(req, res, next) {
    controller.getGraphData(req, res);
});

/**
 * Import page
 */
router.get('/import', auth.checkAuth, function(req, res, next) {
    controller.getImportView(req, res);
});

/**
 * Trigger LinkedIn Crawler
 */
router.post('/import/linkedin', auth.checkAuth, function(req, res, next) {
    controller.postLaunchLinkedinImport(req, res);
});

/**
 * Trigger Twitter Crawler
 */
router.post('/import/twitter', auth.checkAuth, function(req, res, next) {
    controller.postLaunchTwitterImport(req, res);
});

router.get('/trash', auth.checkAuth, function (req, res, next) {
    controller.getTrashView(req, res);
});

/**
 * Send or remove graph to or from trash
 * This route expects a JSON list of IDs
 */
router.patch('/trash/', auth.checkAuth, function (req, res, next) {
    controller.postTrashNetwork(req, res);
});

/**
 * Permanently delete a graph
 */
router.delete('/trash/', auth.checkAuth, function (req, res, next) {
    controller.postDeleteNetwork(req, res);
});

module.exports = router;
