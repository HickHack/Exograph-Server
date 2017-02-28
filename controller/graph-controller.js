/**
 * Created by graham on 10/02/17.
 */

var Extractor = require('./../helper/extractor');
var connection = require('../model/connection-model');
var converter = require('../util/conversion-util');
var errors = require('../helper/errors');

var extractor = new Extractor();

var GraphController = module.exports = function GraphController() {
};

GraphController.prototype.handleImport = function (req, res) {
    res.render('graph/import', {
        title: process.conf.app.NAME,
        pageName: 'Import',
        user: req.user
    });
};

GraphController.prototype.launchLinkedinImport = function (req, res) {
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
    var networkId = parseInt(req.params['id']);

    req.user.getNetwork(networkId)
        .then(network => {
            network.getGraph()
                .then(graph => {
                    res.send(JSON.stringify(graph));
                })
                .catch(err => {
                    console.log(err);

                    res.status(400)
                        .send(new errors.ErrorResponse({
                                message: 'Unable to load graph',
                                redirect: '/'
                            })
                        );
                });
        })
        .catch(err => {
            console.log(err);

            res.status(400)
                .send(new errors.ErrorResponse({
                        message: 'Unable to load network',
                        redirect: '/'
                    })
                );
        });
};

GraphController.prototype.handleLoadConnection = function (req, res) {

    connection.get(req.params['id'], function (err, result) {
        if (err) {
            var message = {message: 'Failed to load Connection'};
            res.send(JSON.stringify(message));
        } else {
            res.send(JSON.stringify(result));
        }
    });
};

GraphController.prototype.handleTrashView = function (req, res) {

    req.user.getNetworks(function (err, networks) {
        res.render('graph/trash', {
            title: process.conf.app.NAME,
            user: req.user,
            pageName: 'Trash',
            networks: networks
        });
    });
};

GraphController.prototype.handleTrashNetwork = function (req, res) {
    var ids = req.body.ids;

    if (ids && ids.constructor === Array) {
        var fn = function asyncGetNetworks(id) {
            return new Promise((resolve, reject) => {
                req.user.getNetwork(id)
                    .then(network => {
                        resolve(network);
                    })
                    .catch(error => {
                        reject(error)
                    });
            });
        };

        var actions = ids.map(fn);

        Promise.all(actions)
            .then(networks => {
                var promises = [];

                networks.forEach(network => {
                    network.isTrash = !network.isTrash;
                    promises.push(network.patch());
                });

                Promise.all(promises)
                    .then(() => {
                        res.status(200).send('/graph/trash');
                    });

            })
            .catch(() => {
                res.status(400).send(new errors.ErrorResponse({
                    message: 'Please refresh your browser'
                }));
            });

    } else {
        res.status(400).send();
    }
};

GraphController.prototype.handleDeleteNetwork = function (req, res) {
    var ids = req.body.ids;

    if (ids && ids.constructor === Array) {
        var fn = function asyncGetNetworks(id) {
            return new Promise((resolve, reject) => {
                req.user.getNetwork(id)
                    .then(network => {
                        resolve(network);
                    })
                    .catch(error => {
                        reject(error)
                    });
            });
        };

        var actions = ids.map(fn);

        Promise.all(actions)
            .then(networks => {
                var promises = [];

                networks.forEach(network => {
                    network.isTrash = !network.isTrash;
                    promises.push(network.patch());
                });

                Promise.all(promises)
                    .then(() => {
                        res.status(200).send('/graph/trash');
                    });

            })
            .catch(() => {
                res.status(400).send(new errors.ErrorResponse({
                    message: 'Please refresh your browser'
                }));
            });

    } else {
        res.status(400).send();
    }
};