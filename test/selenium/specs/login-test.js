var chai = require("chai");
var LoginPage = require('../pages/login-page');
var ComplexHeader = require('../components/complex-header');

var assert = chai.assert;

describe("login tests", function () {

    it('should login successfully', function () {
        LoginPage.login(process.env.USERNAME, process.env.PASSWORD, function () {
            assert(browser.isVisible('.panel-primary'));
            assert(!LoginPage.message_panel.isVisible());
        });
    });

    it('should login failure with incorrect password', function () {
        ComplexHeader.profile_dropdown_toggle.get().click();
        ComplexHeader.profile_dropdown_toggle.items.logout.get().click();

        LoginPage.form.waitForExist(5000);
        LoginPage.login(process.env.USERNAME, "Pd!", function () {
            assert(!browser.isVisible('.panel-primary'));
            assert(LoginPage.message_panel.isVisible());
        });
    });

    it('should login failure with incorrect email', function () {
        LoginPage.form.waitForExist(5000);
        LoginPage.login("t@t.ie", process.env.PASSWORD, function () {
            assert(!browser.isVisible('.panel-primary'));
            assert(LoginPage.message_panel.isVisible());
        });
    });
});

