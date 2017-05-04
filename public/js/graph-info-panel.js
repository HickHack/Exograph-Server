var graphInfoWidget = null;

function GraphInfoWidget(dataEndpoint) {
    this.graphContainer = $('.graph');
    this.container = $('.graph-info-container');
    this.imgContainer = $('.info-img-container');
    this.infoItemsContainer = $('.info-items');
    this.friendItemsContainer = $('.friend-items');
    this.model = {};
    graphInfoWidget = this;

    this.clean();

    this.loadData(dataEndpoint, function (model) {
        graphInfoWidget.model = model;
        graphInfoWidget.layout();
        graphInfoWidget.setupEventHandlers();
    });
}

GraphInfoWidget.prototype.setupEventHandlers = function () {
    $('.close-btn').on('click', function () {
        graphInfoWidget.setVisible(false);
    });
};

GraphInfoWidget.prototype.setVisible = function (isVisible) {
    if (isVisible) {
        this.container.show();
    } else {
        this.container.hide();
    }
};

GraphInfoWidget.prototype.isVisible = function () {
    return this.container.is(":visible");
};

GraphInfoWidget.prototype.layout = function () {
    var width = this.graphContainer.width();
    var height = this.graphContainer.height();

    var containerWidth = width / 3;
    this.container.width(containerWidth);
    this.container.height(height);
    this.infoItemsContainer.width(containerWidth - 20);
    this.friendItemsContainer.width(containerWidth - 20);

    this.renderImage();
    this.populateInfoItems();
    this.populateFriendItems(this.model.friends);
    this.setVisible(true);
};

GraphInfoWidget.prototype.renderImage = function () {
    if (this.model) {
        var link = $('<a/>', {href: this.model.profileImageUrl.attr.value});

        $('<img/>', {
            'src': this.model.profileImageUrl.value,
            'class': 'img-responsive img-thumbnail center-block'
        })
            .attr('onError', 'imgError(this)')
            .appendTo(link);

        link.appendTo(this.imgContainer);
    }
};

GraphInfoWidget.prototype.populateInfoItems = function () {
    var excluded = ['friends'];

    if (this.model) {
        var table = $('<table/>', {
            'class': 'table table-bordered table-striped table-responsive'
        });

        var tbody = $("<tbody/>");
        for (var prop in this.model) {
            if (excluded.includes(prop)) {
                continue
            }

            if (this.model[prop].attr.type == 'text' && (this.model[prop].value)) {
                var row = $('<tr/>');
                var key = $('<td/>').text(this.model[prop].key).addClass('text-center');
                var value = $('<td/>').text(this.model[prop].value).addClass('text-center');

                row.append(key).append(value);
                tbody.append(row);
            }
        }

        table.append(tbody).appendTo(this.infoItemsContainer);
    }
};

GraphInfoWidget.prototype.populateFriendItems = function (friends) {

    if (friends.length > 0) {
        var friendsCount = friends.length ? friends.length : false;

        var table = $('<table/>', {
            'class': 'table table-bordered table-responsive text-center'
        });

        var th = $("<tr/>")
            .append($("<th/>", {'class': 'text-center'}).text("Friends (" + friendsCount + ")").attr('colspan', 2));
        table.append($("<thead/>").append(th));

        var count = 1;
        var tbody = $("<tbody/>");
        var row = $('<tr/>');
        for (var friend in friends) {
            var name = friends[friend].node.name.value;
            var td = $('<td/>');
            var a = $("<a/>", {'class': 'widget-search'})
                .attr('href', '#')
                .attr('data-query', name)
                .text(name);

            td.append(a);
            if (count % 2 == 0 && count != 0 || (friendsCount == 1)) {
                tbody.append(row.append(td));
                row = $('<tr/>');
            } else {
                row.append(td);
            }

            count++;
        }

        table.append(tbody);
        table.appendTo(this.friendItemsContainer);
    }
};

GraphInfoWidget.prototype.loadData = function (endpoint, callback) {
    $.getJSON(endpoint, function (response) {
        return callback(response.node);
    });
};

GraphInfoWidget.prototype.clean = function () {
    this.imgContainer.empty();
    this.infoItemsContainer.empty();
    this.friendItemsContainer.empty();
};

function imgError(image) {
    image.onError = "";
    image.src = "/img/person-placeholder.jpg";
    return true;
}