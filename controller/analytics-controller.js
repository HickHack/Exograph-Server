var errors = require('../helper/errors');

var AnalyticsController = module.exports = function GraphController() {};

AnalyticsController.prototype.getView = function (req, res) {
    req.user.getNetwork(req.params['id'])
        .then(network => {
            network.getSummary(function (err, data) {
                if (err) {
                    res.status(400).send();
                } else {
                    res.render('analytics/view', {
                        title: process.conf.app.NAME,
                        user: req.user,
                        pageName: 'Analytics',
                        degreeEndpoint: '/analytics/data/degree/' + req.params['id'],
                        locationEndpoint: '/analytics/data/location/' + req.params['id'],
                        summary: {
                            name: network.name,
                            nodes: data['total_nodes'],
                            edges: data['total_edges'],
                            mean_degree: Math.round(data['total_edges'] / data['total_nodes'] * 100) / 100
                        }
                    });
                }
            });
        })
        .catch(err => {
            res.status(400)
                .send(new errors.ErrorResponse({
                        message: 'Unable to load network',
                        redirect: '/'
                    })
                );
        });
};

AnalyticsController.prototype.getDegreeData = function (req, res) {
    req.user.getNetwork(req.params['id'])
        .then(network => {
            network.getDegreeDistribution(function (err, data) {
                if (err) {
                    res.status(400).send();
                } else {
                    res.status(200).send(data);
                }
            });
        })
        .catch(err => {
            res.status(400)
                .send(new errors.ErrorResponse({
                        message: 'Unable to load network',
                        redirect: '/'
                    })
                );
        });
};

AnalyticsController.prototype.getLocationData = function (req, res) {
    req.user.getNetwork(req.params['id'])
        .then(network => {
            network.getLocations(function (err, data) {
                if (err) {
                    res.status(400).send();
                } else {
                    res.status(200).send(data);
                }
            });
        })
        .catch(err => {
            res.status(400)
                .send(new errors.ErrorResponse({
                        message: 'Unable to load network',
                        redirect: '/'
                    })
                );
        });
};