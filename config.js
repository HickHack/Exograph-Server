/**
 * Created by graham on 20/01/17.
 */

var fs = require('fs');
var util = require('util');

var config = {}

config.global = {
    NEO4J_URL: 'http://neo4j:neo4j@localhost:7474',
    SESSION_SECRET: 'QlV39QxK9K9K714j57u2M9JewW1q06B4',
    EXTRACTOR_LOGIN: {
        "username": "graham",
        "password": "Pa55w0rd!"
    },
    EXTRACTOR_TOKEN_URL: 'http://127.0.0.1:8000/api/v1/api-token-auth',
    EXTRACTOR_TEMPLATE: {
        headers: {
            'Content-Type': 'application/json'
        },
        url: '',
        body: ''
    }
};

config.app = {
    NAME: 'Exograph',
    PORT: 3000,
};

// Overload console.log to write stout to file
if (fs.exists('log/server.log')) {
    var logstdout = process.stdout;
    var logFile = fs.createWriteStream('log/server.log', { flags: 'a' });

    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + ' - ' + new Date() + '\n');
        logstdout.write(util.format.apply(null, arguments) + '\n');
    };



    console.error = console.log;
}

module.exports = config;