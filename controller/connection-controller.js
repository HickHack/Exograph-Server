/**
 * Created by graham on 12/04/17.
 */

var connection = require('../model/connection-model');

var ConnectionController = module.exports = function ConnectionController() {
};

ConnectionController.prototype.getConnection = function (req, res) {

    connection.get(req.params['id'], function (err, result) {
        if (err) {
            var message = {message: 'Failed to load Connection'};
            res.send(JSON.stringify(message));
        } else {
            res.send(JSON.stringify(result));
        }
    });
};