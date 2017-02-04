/**
 * Created by graham on 20/01/17.
 */

var config = {}

config.global = {
    NEO4J_URL: 'http://neo4j:neo4j@localhost:7474',
    SESSION_SECRET: 'QlV39QxK9K9K714j57u2M9JewW1q06B4'
}

config.app = {
    NAME: 'Exograph',
    PORT: 3000,
}

module.exports = config;