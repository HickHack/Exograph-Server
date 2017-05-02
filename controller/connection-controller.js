/**
 * Created by graham on 12/04/17.
 */

var connection = require('../model/connection-model');

exports.getConnection = function (req, res) {

    connection.get(req.params['id'], function (err, result) {
        if (err) {
            var message = {message: 'Failed to load Connection'};
            res.json(message);
        } else {
            res.json(result);
        }
    });
};