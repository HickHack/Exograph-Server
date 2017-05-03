function Page () {}

Page.prototype.open = function (path, next) {
    browser.url('/' + path);
    next();
};

module.exports = new Page();
