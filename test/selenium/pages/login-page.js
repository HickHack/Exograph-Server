var Page = require('./page');
var DashboardPage = require("./dashboard-page");

var LoginPage = Object.create(Page, {

    username_input: {
        get: function () {
            return browser.element("input[name='email']");
        }
    },

    password_input: {
        get: function () {
            return browser.element("input[name='password']");
        }
    },
    form: {
        get: function () {
            return browser.element("form");
        }
    },
    signup_link: {
        get: function () {
            return browser.element('.existingLink a');
        }
    },
    title: {
        value: function () {
            return browser.getTitle();
        }
    },
    message_panel: {
        get: function () {
            return browser.element('.message-panel');
        },
        isVisible: function () {
            return this.isVisible();
        }
    },
    open: {
        value: function (next) {
            Page.open.call(this, 'login/', function () {
                return next();
            });
        }
    },

    setUsername: {
        value: function (username, next) {
            this.username_input.setValue(username);
            return next();
        }
    },
    setPassword: {
        value: function (password, next) {
            this.password_input.setValue(password);
            return next();
        }
    },
    follow_link: {
        value: function () {
            this.signup_link.click();
        }
    },
    login: {
        value: function (username, password, next) {
            page = this;
            page.open(function () {
                page.setUsername(username, function () {
                    page.setPassword(password, function () {
                        page.submit(function () {
                            next();
                        });
                    });
                });
            });
        }
    },
    logout: {
        value: function (next) {
            browser.element('#logout').click();
            next();
        }
    },
    submit: {
        value: function (next) {
            browser.submitForm("form");
            next();
        }
    },

});

module.exports = LoginPage;