var graphInfoWidget = null;

function GraphInfoWidget(dataEndpoint) {
    this.graphContainer = $('.graph');
    this.container = $('.graph-info-container');
    this.model = this.loadData(dataEndpoint);
    this.layout();
    this.setupEventHandlers();
    graphInfoWidget = this;
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

GraphInfoWidget.prototype.layout = function() {
    var width = this.graphContainer.width();
    var height = this.graphContainer.height();

    this.container.width(width / 3);
    this.container.height(height);
};

GraphInfoWidget.prototype.loadData = function(endpoint) {
    $.getJSON(endpoint, function (response) {
        console.log(response);
    });
};