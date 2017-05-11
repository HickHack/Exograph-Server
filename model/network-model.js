/**
 * @author Graham Murray
 * @date 7/02/17
 *
 * This model represents a Network node that binds
 * a User to a social graph of Connections
 */

var graph = require('./graph-model');
var converter = require('../util/conversion-util');
var errors = require('../helper/errors');
var db = require('./../helper/db');
var neo4j = new db();

var Network = module.exports = function Network(node, owner) {
    this._node = node;
    this._owner = owner;
};

// Public instance properties
Object.defineProperties(Network.prototype, {
    id: {
        get: function () {
            return this._node._id;
        }
    },
    numConnections: {
        get: function () {
            return this._node.properties['no_connections'];
        }
    },
    jobId: {
        get: function () {
            return this._node.properties['job_id'];
        }
    },
    name: {
        get: function () {
            return this._node.properties['name'];
        }
    },
    type: {
        get: function () {
            return this._node.properties['type'];
        }
    },
    createdTime: {
        get: function () {

            return converter.timeSince(this._node.properties['created_time'] );
        }
    },
    imageRef: {
        get: function () {
            return this._node.properties['image_ref'];
        }
    },
    isTrash: {
        get: function () {
            return this._node.properties['is_trash'];
        },
        set: function (isTrash) {
            this._node.properties['is_trash'] = isTrash;
        },
        configurable: true
    },
    owner: {
        get: function () { return this._owner }
    },
    isLinkedIn: {
        get: function () {
            return this._node.properties['type'] == 'LINKEDIN';
        }
    },
    isTwitter: {
        get: function () {
            return this._node.properties['type'] == 'TWITTER';
        }
    }
});

Network.prototype.toJSON = function () {
    var network = {
        id: this.id,
        numConnections: this.numConnections,
        jobId: this.jobId,
        name: this.name,
        type: this.type,
        createdTime: this.createdTime,
        imageRef: this.imageRef,
        isTrash: this.isTrash
    };

    return network;
};

Network.prototype.getGraph = function () {
    return new Promise((resolve, reject) => {
        graph.get(this, function (err, graph) {
            if (err) {
                reject(err);
            } else {
                resolve(graph);
            }
        });
    });
};

Network.prototype.getDegreeDistribution = function (callback) {
    graph.getDegree(this, function (err, result) {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};

Network.prototype.getLocations = function (callback) {
    graph.getLocations(this, function (err, result) {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};

Network.prototype.getSummary = function (callback) {
    graph.getSummary(this, function (err, result) {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};

Network.get = function (id, user, callback) {
    var query = [
        'MATCH (network:Network)',
        'WHERE id(network) = {id}',
        'RETURN network'
    ].join('\n');

    var params = {
        id: parseInt(id)
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new errors.NodeNotFoundError('No such node with id: ' + id);
            return callback(err);
        }

        var network = new Network(results[0]['network'], user);
        callback(null, network);
    });
};

Network.getAllByUser = function (user, callback) {
    var query = [
        'MATCH (user:User)-[:OWNS]-(network:Network) ',
        'WHERE id(user) = {id} ',
        'RETURN DISTINCT network'
    ].join('\n');

    var params = {
        id: user.id
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, result) {
        if (err) return callback(err);

        if (!result.length > 0) {
            return callback(null, null);
        } else {
            var networks = [];

            result.forEach(function (element) {
                networks.push(new Network(element['network'], user));
            });

            return callback(null, networks);
        }
    });
};

Network.getAllByQuery = function (user, searchQuery, callback) {
    var query = [
        'MATCH (user:User)-[:OWNS]-(network:Network) ',
        "WHERE id(user) = {id} AND network.name =~ '(?i).*"+ searchQuery.toLowerCase() +".*' ",
        'RETURN DISTINCT network'
    ].join('\n');

    var params = {
        id: user.id
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, result) {
        if (err) return callback(err);

        if (!result.length > 0) {
            return callback(null, null);
        } else {
            var networks = [];

            result.forEach(function (element) {
                networks.push(new Network(element['network'], user));
            });

            return callback(null, networks);
        }
    });
};

Network.prototype.patch = function () {
    return new Promise((resolve, reject) => {
        var query = [
            'MATCH (network:Network {job_id: {jobId}})',
            'SET network += {props}',
            'RETURN network',
        ].join('\n');

        var params = {
            jobId: this.jobId,
            props: this._node.properties
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, results) {

            if (err){
                reject(err);
            } else if (!results.length) {
                err = new Error('Network ' + this.id + ' doesn\'t exist');
                return reject(err);
            } else {
                resolve(null);
            }
        });
    });
};

Network.prototype.delete = function () {
    return new Promise((resolve, reject) => {
        var query = [
            'MATCH (user:User)-[owns:OWNS]-(network:Network)-[contains:CONTAINS]-(connection:Connection)',
            'SET network += {props}',
            'RETURN network',
        ].join('\n');

        var params = {
            jobId: this.jobId,
            props: this._node.properties
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, results) {

            if (err){
                reject(err);
            } else if (!results.length) {
                err = new Error('Network ' + this.id + ' doesn\'t exist');
                return reject(err);
            } else {
                resolve(null);
            }
        });
    });
};

Network.prototype.getContainingRootId = function(label, callback) {
    var query = [
        'MATCH (user:User)-[owns:OWNS]->(network:Network)-[contains:CONTAINS]->(root:'+ label +')',
        'WHERE id(user) = {userId} AND id(network) = {networkId}',
        'RETURN root',
        'LIMIT 1'
    ].join('\n');

    var params = {
        userId: this.owner.id,
        networkId: this.id
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, result) {
        if (err){
            console.log(err);
            return callback(err);
        };

        if(result.length > 0) {
            return callback(null, result[0]['root']._id);
        }

        var msg = 'Not found where userId = ' + userId + ' and networkId = ' + networkId;
        var error = new errors.NodeNotFoundError(msg);
        console.log(error);

        return callback(error);
    });
};
