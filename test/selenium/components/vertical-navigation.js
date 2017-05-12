var VerticalNavigation = Object.create({

    get: function () {
        return browser.element('.sidebar-nav');
    }
});

module.exports = VerticalNavigation;