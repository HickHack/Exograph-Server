$(function () {
    var container = $('.job-alerts-container');
    var list = container.find('ul');

    container.click(function () {
        clean();

        requestData(function (err, model) {
            populateItems(model);
        });
    });

    function requestData(next) {
        $.ajax({
            url: '/job/alert',
            dataType: 'json',
            success: function (data) {
                next(null, data);
            },
            error: function (jqXHR, exception) {
                next(exception);
            }
        });
    }

    function populateItems(model) {

        if (model.jobs.length) {
            for (var prop in model.jobs) {
                list.append(createItem(model.jobs[[prop]])).append(getDivider());
            }
        } else if (model.message) {
            list.append(createMessage(model.message));
            return;
        } else {
            var message = 'Something went wrong!';
            list.append(createMessage(message));
            return;
        }

        list.append(getFooter()).appendTo(container);
    }
    
    function createItem(job) {
        var item = $('<li/>');
        var divider = $('<li/>', {'class': 'divider'});
        var link = $('<a/>', {href: '#'});
        var div = $('<div/>');
        var icon = $('<i/>', {'class': getIconClass(job.type)});
        var time = $('<span/>', {'class': 'pull-right text-muted small'});

        time.text(job.startTime);

        div.append(icon).append(job.name).append(time);
        link.append(div).appendTo(item);

        return item;
    }
    
    function createMessage(message) {
        return $('<li/>', {'class': 'text-center'}).text(message);
    }

    function getDivider() {
        return $('<li/>', {'class': 'divider'});
    }

    function getFooter() {
        var footer = $('<li/>')
            .append(
                $('<a/>', {'class': 'text-center', href: '/job/all'})
                    .append(
                        $('<strong/>').text('See All Jobs')
                    ).append(
                    $('<i/>', {'class': 'fa fa-angle-right'})
                )
            );

        return footer;
    }
    
    function clean() {
        list.empty();
    }

    function setVisibility(isVisible) {
        if (isVisible) {
            list.show();
        } else {
            list.hide();
        }
    }

});

function getIconClass(type) {
    if (type == 'LINKEDIN') {
        return 'fa fa-linkedin fa-fw text-with-icon'
    }

    return 'fa fa-twitter fa-fw text-with-icon'
}