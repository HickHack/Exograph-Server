/**
 * @author Graham Murray
 * @date 13/03/17
 *
 * This model represents a Follower node
 */

var db = require('./../helper/db');
var converter = require('../util/conversion-util');
var errors = require('../helper/errors');

var neo4j = new db();

var Follower = module.exports = function Follower(node) {
    this._node = node;
    this._friends = [];
};

// Public instance properties
Object.defineProperties(Follower.prototype, {
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
            return converter.unixTimeToFormattedTime(this._node.properties['member_since']);
        }
    },
    profileUrl: {
        get: function () {
            return converter.base64Decode(this._node.properties['profile_url']);
        }
    },
    profileImageUrl: {
        get: function () {
            var url = converter.base64Decode(
                this._node.properties['profile_image_url']
            );

            if (url == '' || url == ' ') {
                return '/img/person-placeholder.jpg'
            }

            return url;
        }
    },
    friendsCount: {
        get: function () {
            return this._node.properties['friends_count']
        }
    },
    followersCount: {
        get: function () {
            return this._node.properties['followers_count']
        }
    },
    screenName: {
        get: function () {
            return '@' + this._node.properties['screen_name']
        }
    },
    location: {
        get: function () {
            return converter.base64Decode(this._node.properties['location'])
        }
    },
    description: {
        get: function () {
            return converter.base64Decode(this._node.properties['description'])
        }
    },
    friends: {
        set: function (friends) {
            this._friends = friends;
        },
        get: function () {
            return this._friends;
        }
    }
});

Follower.prototype.toJSON = function () {
    var node = {
        node: {
            name: {
                key: 'Name',
                value: this.name,
                attr: {
                    type: 'text'
                }
            },
            screenName: {
                key: 'Screen Name',
                value: this.screenName,
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
            followerCount: {
                key: 'No. Followers',
                value: this.followersCount,
                attr: {
                    type: 'text'
                }
            },
            friendsCount: {
                key: 'No. Friends',
                value: this.friendsCount,
                attr: {
                    type: 'text'
                }
            },
            description: {
                key: 'Description',
                value: this.description,
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
            },
            friends: this.friends
        }
    };

    return node;
};


Follower.get = function (id, callback) {
    var query = [
        'MATCH (follower:Follower)-[:IS_FOLLOWING]-(friend:Follower)',
        'WHERE id(follower) = {id}',
        'RETURN follower, friend'
    ].join('\n');

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

        var follower = new Follower(results[0]['follower']);
        var friends = [];
        var ids = [];

        results.forEach(function (row) {
            var friend = row.friend;
            var id = friend._id;

            if (!ids.includes(id)) {
                friends.push(new Follower(friend));
                ids.push(id);
            }
        });

        follower.friends = friends;
        callback(null, follower);
    });
};


Follower.getContainingRootId = function(userId, networkId, callback) {
    var query = [
        'MATCH (user:User)-[owns:OWNS]->(network:Network)-[contains:CONTAINS]->(root:Follower)',
        'WHERE id(user) = {userId} AND id(network) = {networkId}',
        'RETURN root',
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
            var node = new Follower(result[0]['root']);
            return callback(null, node);
        }

        var msg = 'Follower not found where userId = ' + userId + ' and networkId = ' + networkId;
        var error = new errors.NodeNotFoundError(msg);
        console.log(error);

        return callback(error);
    });
};

