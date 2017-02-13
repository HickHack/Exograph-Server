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
 * map to edges
 */

var db = require('./db');
var neo4j = new db();

var Graph = module.exports = function Graph() {
};

Graph.prototype.load = function (userId, networkId, callback) {
    var query = [
        'MATCH (a:Connection)-[r:CONNECTED_TO]-(b:Connection) ',
        'RETURN [a, b] AS nodes, r AS relationship'
    ].join('\n');

    neo4j.run({
        query: query,
        params: {}
    }, function (err, result) {
        if (err) return callback(err);

        parseCypherResult(result, function (d3Model) {
            return callback(d3Model);
        });
    });
};

function parseCypherResult(results, callback) {
    var nodes = [], links = [];

    results.forEach(function (row) {
        row.nodes.forEach(function (n) {
            if (idIndex(nodes, n._id) == null)
                nodes.push({id: n._id, label: n.labels[0], name: n.properties.name});
        });

        var r = row.relationship;
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


