/**
 * Created by graham on 10/02/17.
 */

var Extractor = require('./../helper/extractor');
var Graph = require('../model/graph-model');
var connection = require('../model/connection-model');
var converter = require('../util/conversion-util');

var extractor = new Extractor();

var GraphController = module.exports = function GraphController() {};

GraphController.prototype.handleImport = function(req, res) {
    res.render('graph/import', {
        title: process.conf.app.NAME,
        pageName: 'Import',
        user: req.user
    });
};

GraphController.prototype.launchLinkedinImport = function (req, res){
    extractor.launchLinkedin({
        name: req.body.importName,
        username: req.body.linkedinEmail,
        password: req.body.linkedinPassword,
        user_id: req.user.id
    }, function (err, job) {
        if (err) {
            var error = {error: err.message};
            res.send(JSON.stringify(error));
        } else {
            job.start_time = converter.unixTimeToFormattedTime(job.start_time);

            res.send(JSON.stringify(job));
        }
    });
};

GraphController.prototype.handleViewPage = function (req, res) {
    res.render('graph/view', {
        title: process.conf.app.NAME,
        user: req.user,
        graphEndpoint: '/graph/data/' + req.params['id']
    });
};

GraphController.prototype.handleGraphLoad = function (req, res) {
    var graph = new Graph();
    var networkId = parseInt(req.params['id']);

    graph.load(req.user.id, networkId, function (graph) {
        res.send(JSON.stringify(graph));
    });
};

GraphController.prototype.handleLoadConnection = function(req, res){

    connection.get(req.params['id'], function (err, result) {
        if (err) {
            var message = {message: 'Failed to load Connection'};
            res.send(JSON.stringify(message));
        } else {
            res.send(JSON.stringify(result));
        }
    });
};