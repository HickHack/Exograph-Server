var Page = require('./page');

var LoginPage = Object.create(Page, {

    username_input: {
        get: function () {
            return browser.element("input[name='username']");
        }
    },

    password_input: {
        get: function () {
            return browser.element("input[name='password']");
        }
    },
    submit_form: {
        get: function () {
            return browser.element("button[type='submit']");
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
    open: {
        value: function (next) {
            Page.open.call(this, 'login/', function () {
                next();
            });
        }
    },

    setUsername: {
        value: function (username, next) {
            this.username_input.setValue(username);
            next();
        }
    },

    setPassword: {
        value: function (password, next) {
            this.username_input.setValue(password);
            next();
        }
    },

    follow_link: {
        value: function () {
            this.signup_link.click();
        }
    },

    submit: {
        value: function () {
            this.submit_form.click();
            var el = browser.element('.page-header');

            browser.waitUntil(function () {
                return el.getText();
            }, 5000, 'expected dashboard')
        }
    },

});

module.exports = LoginPage;