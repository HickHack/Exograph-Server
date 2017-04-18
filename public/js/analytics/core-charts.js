/**
 * Created by graham on 17/04/17.
 */

$(document).ready(function () {
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(drawDegreeScatterPlot);


    function drawDegreeScatterPlot() {

        $.getJSON($('.degree-viz').attr('data-endpoint'), function (data) {
            var data = google.visualization.arrayToDataTable(data);

            var options = {
                legend: {position: 'none'},
                hAxis: {title: 'Total Degree'},
                vAxis: {title: 'Node Frequency'},
                lineWidth: 1
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('degree-dist'));
            chart.draw(data, options);
        });
    }
});