var chai = require("chai");
var VisualisationPage = require('../pages/visualisation-page');
var LoginPage = require('../pages/login-page');
var assert = chai.assert;
var expect = chai.expect;

describe("Dashboard tests", function () {

    before(function () {
        VisualisationPage.open(function () {
            if (!VisualisationPage.isVisible()) {
                LoginPage.login(process.env.USERNAME, process.env.PASSWORD, function () {});
            }
        });
    });

    describe("Test buttons work", function () {
        it('it should become visible on button click and hide on second click', function () {
            VisualisationPage.open(function () {
                VisualisationPage.svg.waitForVisible(10000);

                var button = VisualisationPage.sideNavToggle;
                var nav = VisualisationPage.verticalNav.get();

                button.click();
                nav.waitForVisible(2000);
                assert(nav.isVisible());

                button.click();
                assert(!nav.isVisible());
            });
        });

    });
});