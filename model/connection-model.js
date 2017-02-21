/**
 * @author Graham Murray
 * @date 13/02/17
 *
 * This model represents a Connection node
 */

var db = require('./../helper/db');
var converter = require('../util/conversion-util');
var errors = require('../helper/errors')

var neo4j = new db();

var Connection = module.exports = function Connection(node) {
    this._node = node;
};

// Public instance properties
Object.defineProperties(Connection.prototype, {
    id: {
        get: function () {
            return this._node._id;
        }
    },
    name: {
        get: function () {
            return this._node.properties['name'];
        }
    },
    memberSince: {
        get: function () {
            return converter.unixTimeToFormattedTime(this._node.properties['member_since'] / 1000);
        }
    },
    connectionDate: {
        get: function () {
            return converter.unixTimeToFormattedTime(this._node.properties['connection_date'] / 1000);
        }
    },
    profileUrl: {
        get: function () {
            return converter.base64Decode(this._node.properties['profile_url']);
        }
    },
    profileImageUrl: {
        get: function () {
            var url = this._node.properties['profile_image_url'];

            if (url == '') {
                return '/img/person-placeholder.jpg'
            }

            return converter.base64Decode(url);
        }
    },
    phone: {
        get: function () {
            return this._node.properties['phone'];
        }
    },
    email: {
        get: function () {
            return this._node.properties['email'];
        }
    },
    company: {
        get: function () {
            return this._node.properties['company'];
        }
    },
    title: {
        get: function () {
            return this._node.properties['title']
        }
    },
    location: {
        get: function () {
            return this._node.properties['location'];
        }
    }
});

Connection.prototype.toJSON = function () {
    var node = {
        node: {
            name: {
                key: 'Name',
                value: this.name,
                attr: {
                    type: 'text'
                }
            },
            connectionDate: {
                key: 'Connected',
                value: this.connectionDate,
                attr: {
                    type: 'text'
                }
            },
            memberSince: {
                value: this.memberSince,
                key: 'Joined',
                attr: {
                    type: 'text'
                }
            },
            profileImageUrl: {
                key: 'Profile Image',
                value: this.profileImageUrl,
                attr: {
                    type: 'link',
                    value: this.profileUrl
                }
            },
            phone: {
                key: 'Phone No',
                value: this.phone,
                attr: {
                    type: 'text'
                }
            },
            email: {
                key: 'Email',
                value: this.email,
                attr: {
                    type: 'text'
                }
            },
            company: {
                key: 'Company',
                value: this.company,
                attr: {
                    type: 'text'
                }
            },
            title: {
                key: 'Job Title',
                value: this.title,
                attr: {
                    type: 'text'
                }

            },
            location: {
                key: 'Location',
                value: this.location,
                attr: {
                    type: 'text'
                }
            }
        }
    };

    return node;
};

Connection.get = function (id, callback) {
    var query = [
        'MATCH (connection:Connection)',
        'WHERE id(connection) = {id}',
        'RETURN connection'
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

        var node = new Connection(results[0]['connection']);
        callback(null, node);
    });
};

Connection.getNodeForNetworkByUserId = function(userId, networkId, callback) {
    var query = [
        'MATCH (user:User)-[owns:OWNS]->(network:Network)-[contains:CONTAINS]->(connection:Connection)',
        'WHERE id(user) = {userId} AND id(network) = {networkId}',
        'RETURN connection',
        'LIMIT 1'
    ].join('\n');

    var params = {
        userId: userId,
        networkId: networkId
    }

    neo4j.run({
        query: query,
        params: params
    }, function (err, result) {
        if (err){
            console.log(err);
            return callback(err);
        };

        if(result.length > 0) {
            var node = new Connection(result[0]['connection']);
            return callback(null, node);
        }

        var msg = 'Connection not found where userId = ' + userId + ' and networkId = ' + networkId;
        var error = new errors.NodeNotFoundError(msg);
        console.log(error);

        return callback(error);
    });
};

