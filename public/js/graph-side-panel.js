var graphInfoWidget = null;

function GraphInfoWidget(dataEndpoint) {
    this.graphContainer = $('.graph');
    this.container = $('.graph-info-container');
    this.imgContainer = $('.info-img-container');
    this.itemsContainer = $('.info-items');
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
        graphInfoWidget.setVisibility(false);
    });
};

GraphInfoWidget.prototype.setVisibility = function (isVisible) {
    if (isVisible) {
        this.container.show();
    } else {
        this.container.hide();
    }
};

GraphInfoWidget.prototype.isVisible = function () {
    return this.container.is(":visible");
};

GraphInfoWidget.prototype.layout = function() {
    var width = this.graphContainer.width();
    var height = this.graphContainer.height();

    this.container.width(width / 3);
    this.container.height(height);

    this.renderImage();
    this.populateItems();
    this.setVisibility(true);
};

GraphInfoWidget.prototype.renderImage = function () {
    if (this.model) {
        var link = $('<a/>', {href: this.model.profileImageUrl.attr.value});

        $('<img/>', {
            'src': this.model.profileImageUrl.value,
            'class': 'img-responsive img-thumbnail center-block'
        }).appendTo(link);

        link.appendTo(this.imgContainer);
    }
};

GraphInfoWidget.prototype.populateItems = function () {
    if (this.model) {
        var table = $('<table/>', {
            'class': 'table table-bordered'
        });

        for (var prop in this.model) {
            if (this.model[prop].attr.type == 'text' && this.model[prop].value != '') {
                var row = $('<tr/>');
                var key = $('<td/>').text(this.model[prop].key).addClass('text-right');
                var value = $('<td/>').text(this.model[prop].value).addClass('text-center');

                row.append(key).append(value);
                table.append(row);
            }
        }

        table.appendTo(this.itemsContainer);
    }
};

GraphInfoWidget.prototype.loadData = function(endpoint, callback) {
    $.getJSON(endpoint, function (response) {
        console.log(response);
        return callback(response.node);
    });
};

GraphInfoWidget.prototype.clean = function () {
    this.imgContainer.empty();
    this.itemsContainer.empty();
};
