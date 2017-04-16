/**
 * Created by graham on 16/04/17.
 */

/**
 * Created by graham on 10/02/17.
 */
var errors = require('../helper/errors');

var AnalyticsController = module.exports = function GraphController() {};

AnalyticsController.prototype.getView = function (req, res) {
    res.render('analytics/view', {
        title: process.conf.app.NAME,
        user: req.user,
        pageName: 'Analytics',
        degreeEndpoint: '/data/degree/' + req.params['id']
    });
};

AnalyticsController.prototype.getDegreeDistribution = function (req, res) {
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