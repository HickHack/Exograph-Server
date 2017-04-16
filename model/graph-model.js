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

function getDegree(network, label, rel, callback) {
    var query = [
        'MATCH (head:' + label + ')',
        'WHERE id(head) = {rootId}',
        'CALL apoc.path.expandConfig(head, {config}) YIELD path',
        'WITH LAST(NODES(path)) as a',
        'MATCH (a)-[r]->(b)',
        'WITH a as nodes, COUNT(DISTINCT r) as degree',
        'RETURN [degree, COUNT(nodes)] as data'
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

            var data = [["No. nodes", "Degree"]];
            for (var i = 0; i < result.length; i++) {
                data.push([result[i].data[0], result[i].data[1]]);
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


