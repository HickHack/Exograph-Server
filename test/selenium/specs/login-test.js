var chai = require("chai");
var LoginPage = require('../pages/login-page');
var ComplexHeader = require('../components/complex-header');

var assert = chai.assert;

describe("login tests", function () {

    it('should login successfully', function () {
        LoginPage.login("graham.murr@yahoo.ie", "Pa55w0rd!", function () {
            assert(browser.isVisible('.panel-primary'));
            assert(!LoginPage.message_panel.isVisible());
        });
    });

    it('should login failure with incorrect password', function () {
        ComplexHeader.profile_dropdown_toggle.get().click();
        ComplexHeader.items.logout.get().click();

        LoginPage.form.waitForExist(5000);
        LoginPage.login("graham.murr@yahoo.ie", "Pd!", function () {
            assert(!browser.isVisible('.panel-primary'));
            assert(LoginPage.message_panel.isVisible());
        });
    });

    it('should login failure with incorrect email', function () {
        LoginPage.form.waitForExist(5000);
        LoginPage.login("graham.murr@yahoo.i", "Pa55w0rd!", function () {
            assert(!browser.isVisible('.panel-primary'));
            assert(LoginPage.message_panel.isVisible());
        });
    });
});

