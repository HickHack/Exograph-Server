$(document).ready(function () {

    var table = new JobsTable();

    setup();

    function setup() {
        table.setup();

        window.pagObj = $('#pagination').twbsPagination({
            totalPages: $("#page-wrapper").find("nav").attr("data-total-pages"),
            visiblePages: 5,
            href: false,
            onPageClick: function (event, page) {
                requestPage(page);
            }
        })
    }

    function requestPage(pageNum) {
        console.log("Requesting page: " + pageNum);

        $.getJSON("page/" + pageNum, function (data) {
            table.populate(data);
        });
    }

    function JobsTable() {

        Object.defineProperties(this, {
            container: {
                get: function () {
                    return $(".jobs-panel");
                }
            },
            setup: {
                value: function () {
                    this.container.append(
                        $("<table/>", {
                            'class': 'table table-striped table-bordered table-responsive text-center'
                        })
                            .append("<thead/>")
                            .append("<tbody/>")
                    );
                }
            },
            populate: {
                value: function (data) {

                    if (data.pagination['total'] < 1) {
                        this.container.find("table").hide();
                        showEmptyMessage(true);
                    } else {
                        populateHead();
                        populateBody(data.jobs);
                        showEmptyMessage(false);
                        this.container.find("table").show();
                    }
                }
            },
        });

        function showEmptyMessage(isVisible) {
            if (isVisible) {
                table.container.remove("p .message");
                table.container.append(
                    $("<p/>", {'class': 'text-center message'})
                        .text("You dont have any jobs. Try import a graph")
                );

                table.container.find("p .message").show();
            } else {
                table.container.find("p .message").hide();
            }
        }

        function populateHead() {

            table.container.find("thead")
                .empty()
                .append(
                    $("<tr/>")
                        .append($("<th/>", {'class': 'text-center'}).text("Type"))
                        .append($("<th/>", {'class': 'text-center'}).text("Name"))
                        .append($("<th/>", {'class': 'text-center'}).text("Started"))
                        .append($("<th/>", {'class': 'text-center'}).text("Total Time"))
                        .append($("<th/>", {'class': 'text-center'}).text("Status"))
                        .append($("<th/>", {'class': 'text-center'}).text("Success"))
                        .append($("<th/>", {'class': 'text-center'}).text("Complete"))
                );
        }

        function populateBody(jobs) {
            var tbody = table.container.find("tbody");
            tbody.empty();

            if (jobs.length > 0) {
                for (var job in jobs) {
                    var job = jobs[job];

                    tbody.append(
                        $("<tr/>").append(
                            $("<td/>").append(
                                $("<i>", {'class': getIconType(job.type)}
                                ).addClass("text-center")))
                            .append($("<td/>").text(job.name))
                            .append($("<td/>").text(job.startTime))
                            .append($("<td/>").text(job.totalTime))
                            .append($("<td/>").text(job.status))
                            .append($("<td/>").text(job.isSuccess))
                            .append($("<td/>").text(job.isComplete))
                    );
                }
            }
        }

        function getIconType(type) {
            if (type == 'LINKEDIN') {
                return 'fa fa-linkedin fa-1x'
            }

            return 'fa fa-twitter fa-1x'
        }
    }

});