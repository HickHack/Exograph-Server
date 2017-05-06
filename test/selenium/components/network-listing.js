var NetworkListing = Object.create({

    get: function () {
        return browser.element('.network-listing');
    },
    items: {
        get: function () {
            return browser.element(".test-subject");
        },
        actions: {
            get: function () {
                return browser.element(".test-subject .dropdown-menu");
            },
            click: {
                value: function () {
                    browser.element(".test-subject button").click();
                }
            },
            view: {
                get: function () {
                    return browser.element('#profile');
                }
            }
        }
    }
});

module.exports = NetworkListing;