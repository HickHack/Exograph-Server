var Extractor = require('./../helper/extractor');
var connection = require('../model/connection-model');
var converter = require('../util/conversion-util');
var errors = require('../helper/errors');

var extractor = new Extractor();

var GraphController = module.exports = function GraphController() {};

GraphController.prototype.getImportView = function (req, res) {
    res.render('graph/import', {
        title: process.conf.app.NAME,
        pageName: 'Import',
        user: req.user
    });
};

GraphController.prototype.postLaunchLinkedinImport = function (req, res) {
    extractor.launchLinkedin({
        graph_name: req.body.importName,
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

GraphController.prototype.postLaunchTwitterImport = function (req, res) {
    extractor.launchTwitter({
        graph_name: req.body.importName,
        screen_name: req.body.screenName,
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

GraphController.prototype.getViewPage = function (req, res) {
    res.render('graph/view', {
        title: process.conf.app.NAME,
        user: req.user,
        graphEndpoint: '/graph/data/' + req.params['id']
    });
};

GraphController.prototype.getGraphData = function (req, res) {
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

GraphController.prototype.getTrashView = function (req, res) {

    req.user.getNetworks(function (err, networks) {
        res.render('graph/trash', {
            title: process.conf.app.NAME,
            user: req.user,
            pageName: 'Trash',
            networks: networks
        });
    });
};

GraphController.prototype.postTrashNetwork = function (req, res) {
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

GraphController.prototype.deleteNetwork = function (req, res) {
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
                    network.isDeleted = true;
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