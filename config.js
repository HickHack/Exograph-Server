/**
 * Created by graham on 20/01/17.
 */

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

module.exports = config;