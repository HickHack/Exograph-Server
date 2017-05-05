
var ComplexHeader = Object.create({

    header: {
        get: function () {
            return browser.element('navbar-static-top');
        }
    },
    profile_dropdown_toggle: {
        get: function () {
            return browser.element(".profile-img");
        }
    },
    items: {
        profile: {
            get: function () {
                return browser.element('#profile');
            }
        },
        account: {
            get: function () {
                return browser.element('#account');
            }
        },
        logout: {
            get: function () {
                return browser.element('#logout');
            }
        }
    }
});

module.exports = ComplexHeader;