var chai = require("chai");
var DashboardPage = require('../pages/dashboard-page');
var LoginPage = require('../pages/login-page');
var assert = chai.assert;
var expect = chai.expect;

describe("Dashboard tests", function () {

    before(function () {
        DashboardPage.open(function () {
            if (!DashboardPage.isVisible()) {
                LoginPage.login(process.env.USERNAME, process.env.PASSWORD, function () {
                    assert(DashboardPage.networks.isVisible());
                });
            }
        });
    });

    describe("elements on the page should be visible", function () {
        it('should check the standout components are visible and title is correct', function () {
            assert(DashboardPage.networks.isVisible());
            assert(DashboardPage.running_jobs.isVisible());
            assert(DashboardPage.trash_count.isVisible());
            assert(DashboardPage.warnings.isVisible());
            expect(DashboardPage.title.getText()).to.equal("Dashboard");
        });
    });

});