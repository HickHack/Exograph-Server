/**
 * @author Graham Murray
 * @date 7/02/17
 *
 * This model represents a Network node that binds
 * a User to a social graph of Connections
 */

var db = require('./db');
var neo4j = new db();

var Network = module.exports = function Network(node) {
    this._node = node;
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

            return this._node.properties['created_time'];
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

Network.get = function (id, callback) {
    var query = [
        'MATCH (network:Network)',
        'WHERE id(network) = {id}',
        'RETURN network'
    ].join('\n')

    var params = {
        id: parseInt(id),
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such node with id: ' + id);
            return callback(err);
        }

        var network = new Network(results[0]['network']);
        callback(null, network);
    });
};

Network.getAllByUserId = function (userId, callback) {
    var query = [
        'MATCH (user:User)-[:OWNS]-(network:Network) ' +
        'WHERE id(user) = {id} ' +
        'RETURN network'
    ].join('\n')

    var params = {
        id: userId
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, result) {
        if (err) return callback(err);

        if (!result.length > 0) {
            return callback(null, null);
        } else {
            var networks = []

            for (var i in result) {
                networks.push(new Network(result[i]['network']));
            }

            return callback(null, networks);
        }
    });
};

neo4j.createConstraint('Network', 'job_id', function (err) {
    if (err) {
        console.warn(err.message);
    }
});

