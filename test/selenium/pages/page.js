function Page (header, navigation) {
    this._header = header;
    this._navigation = navigation;
}

Object.defineProperties(Page.prototype, {
    header: {
        get: function () {
            return this._header;
        }
    },
    navigation: {
        get: function () {
            return this._navigation;
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
    }
});

module.exports = new Page();
