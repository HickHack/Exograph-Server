/**
 * @author Graham Murray
 * @date 9/02/17
 *
 * This model represents the data structure that is required
 * D3.js to render a graph. The model is composed of a list of
 * nodes with their id, label and attributes, and a second list
 * containing edges represented by id, relationship and attributes.
 * D3 requires that each node is unique in the list and that
 * the relationships refer to the array-index (not the id) of the node.
 * The domain specific terminology D3 uses is Node and Links where links
 * map to edges.
 *
 *
 */

var db = require('./../helper/db');
var connection =  require('./connection-model');
var utils = require('../util/conversion-util');

var neo4j = new db();

var Graph = module.exports = function Graph() {};

Graph.delete = function () {
    
};

Graph.get = function (network, callback) {

    if (network.isLinkedIn) {
        getGraph(network, 'Connection', 'CONNECTED_TO', function (err, model) {
            callback(err, model);
        });
    } else if (network.isTwitter) {
        getGraph(network, 'Follower', 'IS_FOLLOWING', function (err, model) {
            callback(err, model);
        });
    }
};

Graph.getDegree = function (network, callback) {
    if (network.isLinkedIn) {
        getDegree(network, 'Connection', 'CONNECTED_TO', function (err, model) {
            callback(err, model);
        });
    } else if (network.isTwitter) {
        getDegree(network, 'Follower', 'IS_FOLLOWING', function (err, model) {
            callback(err, model);
        });
    }
};

Graph.getLocations = function (network, callback) {
    if (network.isLinkedIn) {
        getLocation(network, 'Connection', 'CONNECTED_TO', function (err, model) {
            callback(err, model);
        });
    } else if (network.isTwitter) {
        getLocation(network, 'Follower', 'IS_FOLLOWING', function (err, model) {
            callback(err, model);
        });
    }
};

Graph.getSummary = function (network, callback) {
    if (network.isLinkedIn) {
        getSummary(network, 'Connection', 'CONNECTED_TO', function (err, model) {
            callback(err, model);
        });
    } else if (network.isTwitter) {
        getSummary(network, 'Follower', 'IS_FOLLOWING', function (err, model) {
            callback(err, model);
        });
    }
};

function getSummary(network, label, rel, callback) {
    var selector = 'b';
    if (network.isLinkedIn) {
        selector = 'a'
    }

    var query = [
        'MATCH (head:' + label + ')',
        'WHERE id(head) = {rootId}',
        'CALL apoc.path.expandConfig(head, {config}) YIELD path',
        'WITH LAST(NODES(path)) as a',
        'MATCH (a)-[r]->(b)',
        'WITH COUNT(DISTINCT '+ selector +') as total_nodes, COUNT(DISTINCT r) as total_edges',
        'RETURN total_nodes, total_edges'
    ].join('\n');

    network.getContainingRootId(label, function (err, result) {
        if(err) return callback(err);

        var params = {
            rootId: result,
            config: {relationshipFilter:rel, uniqueness:'NODE_GLOBAL', bfs: true}
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, result) {
            if (err) return callback(err);

            if (!result.length) {
                var error = new Error("No results found");
                return callback(error, null);
            }

            return callback(null, result[0]);
        });
    })
}

function getLocation(network, label, rel, callback) {

    var query = [
        'MATCH (head:' + label + ')',
        'WHERE id(head) = {rootId}',
        'CALL apoc.path.expandConfig(head, {config}) YIELD path',
        'WITH LAST(NODES(path)) as a',
        'MATCH (a)-[r]->(b)',
        'WITH DISTINCT b as nodes',
        'WITH nodes.location as location',
        'RETURN location, COUNT(location) as count ORDER BY count DESC'
    ].join('\n');

    network.getContainingRootId(label, function (err, result) {
        if(err) return callback(err);

        var params = {
            rootId: result,
            config: {relationshipFilter:rel, uniqueness:'NODE_GLOBAL', bfs: true}
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, result) {
            if (err) return callback(err);

            var data = [["Location", "Frequency"]];

            var count = 0;
            var limit = 6;
            while (count < limit) {
                var location = result[count].location;

                if(network.isTwitter) {
                    location = utils.base64Decode(location);
                }

                if(location != '' && location != ' ') {
                    data.push([location, result[count].count]);
                } else {
                    limit++;
                }
                count++;
            }

            return callback(null, data);
        });
    })
}

function getDegree(network, label, rel, callback) {
    var selector = 'b';
    if (network.isLinkedIn) {
        selector = 'a'
    }

    var query = [
        'MATCH (head:' + label + ')',
        'WHERE id(head) = {rootId}',
        'CALL apoc.path.expandConfig(head, {config}) YIELD path',
        'WITH LAST(NODES(path)) as a',
        'MATCH (a)-[r]->(b)',
        'WITH '+ selector +' as nodes, COUNT(DISTINCT r) as degree',
        'RETURN degree, COUNT(nodes) as nodes ORDER BY degree ASC'
    ].join('\n');

    network.getContainingRootId(label, function (err, result) {
        if(err) return callback(err);

        var params = {
            rootId: result,
            config: {relationshipFilter:rel, uniqueness:'NODE_GLOBAL', bfs: true}
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, result) {
            if (err) return callback(err);

            var data = [["Degree", "No. Nodes"]];
            for (var i = 0; i < result.length; i++) {
                data.push([result[i].degree, result[i].nodes]);
            }

            return callback(null, data);
        });
    })
}

function getGraph(network, label, rel, callback) {
    var query = [
        'MATCH (head:' + label + ')',
        'WHERE id(head) = {rootId}',
        'CALL apoc.path.expandConfig(head, {config}) YIELD path',
        'WITH LAST(NODES(path)) as a',
        'MATCH (a)-[r:'+ rel +']->(b)',
        'RETURN [a, b] as nodes, r as relationships'
    ].join('\n');

    network.getContainingRootId(label, function (err, result) {
        if(err) return callback(err);

        var params = {
            rootId: result,
            config: {relationshipFilter:rel, uniqueness:'NODE_GLOBAL', bfs: true}
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, result) {
            if (err) return callback(err);

            parseGraph(result, function (d3Model) {
                return callback(null, d3Model);
            });
        });
    })
}

function parseGraph(results, callback) {
    var nodes = [], links = [];

    results.forEach(function (row) {
        row.nodes.forEach(function (n) {
            if (idIndex(nodes, n._id) == null)
                nodes.push({
                    id: n._id,
                    type: 'circle',
                    size: 60,
                    score: 1,
                    label: n.labels[0],
                    name: n.properties.name,
                    endpoint: '/'+ n.labels[0].toLowerCase() +'/' + n._id
                });
        });

        var r = row.relationships;
        links = links.concat(
            {source: idIndex(nodes, r._fromId), target: idIndex(nodes, r._toId), type: r.type}
        );
    });

    return callback({
        nodes: nodes,
        links: links
    });
}


function idIndex(a, id) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return i;
    }

    return null;
}


