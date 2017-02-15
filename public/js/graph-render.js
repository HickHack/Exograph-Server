$(document).ready(function () {
    var props = generateProps();
    setGraphVisible(false);

    loadGraph(props, $(".graph").attr("endpoint"), function () {
        setGraphVisible(true);
    });

});

function generateProps() {
    var container = $('.graph-container');

    var height = container.height(),
        width = container.width();

    var props = {
        force: awakenTheForce(height, width),
        svg: configureSvgContainer(height, width),
        fill: d3.scale.category10(),
        radius: 8,
        height: height,
        width: width
    };

    return props;
}

function setGraphVisible(isVisible) {
    setSpinnerVisible(!isVisible);

    if (isVisible) {
        $('.graph').show();
    } else {
        $('.graph').hide();
    }
}

function setSpinnerVisible(visible) {
    if (visible) {
        $('.loading').show();
    } else {
        $('.loading').hide();
    }
}

function awakenTheForce(height, width) {
    var awokenForce = d3.layout.force()
        .gravity(0.5)
        .charge(-400)
        .linkDistance(30)
        .size([width, height]);

    return awokenForce;
}

function configureSvgContainer(height, width) {
    var svg = d3.select(".graph")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("pointer-events", "all");

    return svg;
}

function loadGraph(props, endpoint, callback) {
    d3.json(endpoint, function (error, graph) {
        if (error) throw error;

        var link = props.svg.selectAll("line")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("class", "edge");

        var node = props.svg.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", props.radius - .75)
            .attr("class", "node")
            .style("fill", function (d) {
                return props.fill(d.group);
            })
            .style("stroke", function (d) {
                return d3.rgb(props.fill(d.group)).darker();
            })
            .on("click", function (d) {
                triggerSidePanel(d.endpoint);
            })
            .call(props.force.drag);

        node.append("title")
            .text(function (d) {
                return d.name;
            });

        props.force
            .nodes(graph.nodes)
            .links(graph.links)
            .on("tick", tick)
            .start();


        function tick() {
            node.attr("cx", function (d) {
                return d.x = Math.max(props.radius, Math.min(props.width - props.radius, d.x));
            })
                .attr("cy", function (d) {
                    return d.y = Math.max(props.radius, Math.min(props.height - props.radius, d.y));
                });

            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        }

        return callback();
    });
}

function triggerSidePanel(endpoint) {
    new GraphInfoWidget(endpoint);
}