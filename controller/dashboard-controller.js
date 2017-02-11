/**
 * Created by graham on 10/02/17.
 */

var networkModel = require('../model/network');

var DashboardController = module.exports = function DashboardController() {};


DashboardController.prototype.handleInitialLoad  = function (req, res) {

    networkModel.getAllByUserId(req.user.id, function (err, results) {
        if (err) {
            // TODO Handle error
        } else {
            res.render('graph/dashboard', {
                title: process.conf.app.NAME,
                pageName: 'Dashboard',
                user: req.user,
                networks: results
            });
        }
    });
};
