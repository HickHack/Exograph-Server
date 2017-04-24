/**
 * Created by graham on 17/04/17.
 */

$(document).ready(function () {
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(init);


    function init() {
        drawDegreeScatterPlot();
        drawLocationPieChart();
    }

    function drawDegreeScatterPlot() {

        $.getJSON($('.degree-viz').attr('data-endpoint'), function (data) {
            var dataTable = google.visualization.arrayToDataTable(data);

            var options = {
                legend: {position: 'none'},
                hAxis: {title: 'Total Degree'},
                vAxis: {title: 'Node Frequency'},
                lineWidth: 1
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('degree-dist'));
            chart.draw(dataTable, options);
        });
    }

    function drawLocationPieChart() {

        $.getJSON($('.location-viz').attr('data-endpoint'), function (data) {
            var dataTable = google.visualization.arrayToDataTable(data);
            var options = {
                'chartArea': {'width': '100%', 'height': '80%'},
            };
            var chart = new google.visualization.PieChart(document.getElementById('location-pie'));
            chart.draw(dataTable, options);
        });
    }
});