var LoginPage = require("../pages/login-page");

function Page (header, navigation) {
    this._header = header;
    this._navigation = navigation;
}

Object.defineProperties(Page.prototype, {
    header: {
        get: function () {
            return this._header;
        },
        set: function (header) {
            this._header = header;
        }
    },
    navigation: {
        get: function () {
            return this._navigation;
        },
        set: function (navigation) {
            this._navigation = navigation;
        }
    },
    open: {
        value: function (path, next) {
            browser.url('/' + path);
            return next();
        }
    },
    isLoggedIn: {
        value: function () {
            return browser.element('.profile-img').isVisible();
        }
    },
    login: {
        value: function (next) {
            browser.element("input[name='email']").setValue("graham.murr@yahoo.ie");
            browser.element("input[name='password']").setValue("Pa55w0rd!");
            browser.submitForm("form");
            next();
        }
    }
});

module.exports = new Page();
