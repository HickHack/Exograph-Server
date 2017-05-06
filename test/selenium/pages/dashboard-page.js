var ComplexHeader = require('../components/complex-header');
var NetworkListing = require('../components/network-listing');
var Page = require('./page');

var DashboardPage = Object.create(Page, {

    networkListing: {
        get: function () {
            return NetworkListing;
        }
    },
    isVisible: {
        value: function () {
            return this.networks.isVisible();
        }
    },
    navigation: {
        get: function () {
            return null;
        }
    },
    title: {
        get: function () {
            return browser.element('.page-header');
        },
        getText: function () {
            return this.getText();
        }
    },
    networks: {
        get: function () {
            return browser.element('.panel-primary');
        }
    },
    running_jobs: {
        get: function () {
            return browser.element('.panel-green');
        }
    },
    trash_count: {
        get: function () {
            return browser.element('.panel-yellow');
        }
    },
    warnings: {
        get: function () {
            return browser.element('.panel-red');
        }
    },
    open: {
        value: function (next) {
            Page.open.call(this, 'dashboard/', function () {
                return next();
            });
        }
    },
});

module.exports = DashboardPage;