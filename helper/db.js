/**
 * @author Graham Murray
 * @date 7/02/17
 *
 * Logic for performing cypher queries on Neo4J
 * currently there's no substantial libraries available
 * to perform this task in an elegant manner so this objects
 * here hide away the ugly side of things and make the models
 * more testable
 */

var neo4j = require('neo4j');
var errors = require('./errors');
var config = require('../config');

var Database = module.exports = function Database() {
    this._db = new neo4j.GraphDatabase(config.global.NEO4J_URL);
};

Database.prototype.createConstraint = function (label, property, next) {
    this._db.createConstraint({
        label: label,
        property: property,
    }, function (err, constraint) {
        if (err) {
            var error = new errors.ConstraintError(err.message);
            return next(error);
        }

        if (constraint) {
            console.warn('Registered unique ' + label + ':' + property + ' constraint');
        }

        return next(null, constraint);
    });
};

Database.prototype.run = function (queryParams, next) {
    this._db.cypher(queryParams, function (err, results) {
        return next(err, results);
    });
};

Database.prototype.isConstraintViolation = function (err) {
    return isConstraintViolation = err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation' ||
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintValidationFailed';
};


