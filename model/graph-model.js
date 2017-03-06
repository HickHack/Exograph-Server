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

Graph.getLinkedIn = function (network, callback) {
    var query = [
        'MATCH (head:Connection)',
        'WHERE id(head) = {rootId}',
        'CALL apoc.path.expandConfig(head, {config}) YIELD path',
        'WITH LAST(NODES(path)) as a',
        'MATCH (a)-[r:CONNECTED_TO]->(b)',
        'RETURN [a, b] as nodes, r as relationships'
    ].join('\n');

    connection.getNodeForNetworkByUserId(network.owner.id, network.id, function (err, result) {
        if(err) return callback(err);

        var params = {
            rootId: result.id,
            config: {relationshipFilter:'CONNECTED_TO', uniqueness:'NODE_GLOBAL', bfs: true}
        };

        neo4j.run({
            query: query,
            params: params
        }, function (err, result) {
            if (err) return callback(err);

            parseCypherResult(result, function (d3Model) {
                return callback(null, d3Model);
            });
        });
    })
}


function parseCypherResult(results, callback) {
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
                    endpoint: '/graph/connection/' + n._id
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


