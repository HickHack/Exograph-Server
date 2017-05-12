var Page = require('./page');
var VerticalNavigation = require('../components/vertical-navigation');

var VisualisationPage = Object.create(Page, {

    networkListing: {
        get: function () {
            return NetworkListing;
        }
    },
    isVisible: {
        value: function () {
            return this.loading.isVisible() || this.svg.isVisible();
        }
    },
    verticalNav: {
        get: function () {
            return VerticalNavigation;
        }
    },
    svg: {
        get: function () {
            return browser.element("svg");
        }
    },
    loading: {
        get: function () {
            return browser.element('.loading');
        }
    },
    sideNavToggle: {
        get: function () {
            return browser.element('.expand-collapse-nav button');
        }
    },
    infoToggle: {
        get: function () {
            return browser.element('.node-info button');
        }
    },
    testNode: {
        get: function () {
            return browser.element('//*[@id="3861"]');
        }
    },
    infoWidget: {
        get: function () {
            return browser.element('.graph-info-container');
        }
    },
    open: {
        value: function (next) {
            Page.open.call(this, 'graph/view/3934/', function () {
                return next();
            });
        }
    }
});

module.exports = VisualisationPage;