(function () {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var textCenter = false;
    var outline = false;

    var highlightColor = "#CCFF00";
    var defaultNodeColor = "#587498";
    var defaultLinkColor = "#888";
    var toColor = "fill";
    var toWhite = "stroke";

    var nominalBaseNodeSize = 8;
    var nominalTextSize = 10;
    var maxTextSize = 24;
    var nominalStroke = 1.5;
    var maxStroke = 4.5;
    var maxBaseNodeSize = 36;
    var minZoom = 0.1;
    var maxZoom = 100;
    var minScore = 0;
    var maxScore = 1;
    var highlightTrans = 0.1;

    var svg = null;
    var zoom = null;
    var graph = null;
    var size = null;
    var force = null;
    var color = null;
    var clickFocusNode = null;
    var hoverFocusNode = null;
    var highlight_node = null;
    var searchFocusNodes = [];
    var links = null;
    var nodes = null;
    var text = null;
    var circle = null;
    var graphInfoWidget = null;

    var linkedByIndex = {};

    var isPaused = false;

    $(document).ready(function () {
        initialize();
        loadGraph(function () {
            setGraphVisible(true);
        });
    });

    function initialize() {
        setGraphVisible(false);

        svg = d3.select(".graph").append("svg");
        svg.append("svg:defs").selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 29)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        zoom = d3.behavior.zoom().scaleExtent([minZoom, maxZoom]);
        graph = svg.append("g");
        color = d3.scale.linear()
            .domain([minScore, (minScore + maxScore) / 2, maxScore]);
        size = d3.scale.pow().exponent(1)
            .domain([1, 100])
            .range([8, 24]);
        force = d3.layout.force()
            .gravity(0.5)
            .charge(-5000)
            .linkDistance(50)
            .size([windowWidth, windowHeight]);
    }

    function loadGraph(next) {
        d3.json($(".graph").attr("endpoint"), function (error, model) {

            model.links.forEach(function (d) {
                linkedByIndex[d.source + "," + d.target] = true;
            });

            configureViz(model);

            return next();
        });
    }

    function setGraphVisible(isVisible) {
        setSpinnerVisible(!isVisible);

        if (isVisible) {
            $('.graph').show();
            $('.overlay-container').show();
        } else {
            $('.graph').hide();
            $('.overlay-container').hide();
        }
    }

    function setSpinnerVisible(visible) {
        if (visible) {
            $('.loading').show();
        } else {
            $('.loading').hide();
        }
    }

    function configureViz(model) {
        setLinks(model.links);
        setNodes(model.nodes);
        unleashTheForce(model.nodes, model.links);
        setEventListeners();

        if (outline) {
            toColor = "stroke";
            toWhite = "fill";
        }

        configureSVG();
        resize();
    }

    function configureSVG() {
        svg.style("cursor", "move");
        svg.call(zoom);
    }

    function setLinks(data) {
        links = graph.selectAll(".link")
            .data(data)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", nominalStroke)
            .attr("marker-end", "url(#end)")
            .style("stroke", function (d) {
                if (isNumber(d.score) && d.score >= 0) return color(d.score);
                else return defaultLinkColor;
            });
    }

    function setNodes(data) {
        nodes = graph.selectAll(".node")
            .data(data)
            .enter().append("g")
            .attr("class", "node")
            .attr("id", function (d) {
                return d.id;
            })
            .call(force.drag);

        setCircles();
        setText(data);
    }

    function unleashTheForce(nodes, links) {
        var min = 0;
        var max = 1000;

        for (var i = 0; i < nodes.length; i++) {
            nodes[i].x = Math.floor(Math.random() * (max - min + 1)) + min;
            nodes[i].y = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        force.nodes(nodes)
            .links(links)
            .alpha(0)
            .start();
    }

    function setText(nodes) {
        text = graph.selectAll(".text")
            .data(nodes)
            .enter().append("text")
            .attr("dy", ".35em")
            .style("font-size", nominalTextSize + "px");

        if (textCenter) {

            text.text(function (d) {
                return d.name;
            }).style("text-anchor", "middle");

        } else {
            text.attr("dx", function (d) {
                return (size(d.size) || nominalBaseNodeSize);
            }).text(function (d) {
                return '\u2002' + d.name;
            });
        }
    }

    function setCircles() {
        circle = nodes.append("path")
            .attr("d", d3.svg.symbol()
                .size(function (d) {
                    return Math.PI * Math.pow(size(d.size) || nominalBaseNodeSize, 2);
                })
                .type(function (d) {
                    return d.type;
                })
            )
            .style(toColor, function (d) {
                if (isNumber(d.score) && d.score >= 0) return color(d.score);
                else return defaultNodeColor;
            })
            .style("stroke-width", nominalStroke)
            .style(toWhite, "white");
    }

    function setEventListeners() {
        setMouseListeners();
        setButtonListeners();

    }

    function setMouseListeners() {
        setDoubleClickZoomListener();
        setMouseOverListener();
        setMouseOutListener();
        setMouseDownListener();
        setZoomListener();
        setTickListener();
        setResizeListener();
    }

    function setButtonListeners() {
        setDownloadImageListener();
        setPauseButtonListener();
        setFocusButtonListener();
        setLockButtonListener();
        setInfoButtonListener();
        setSearchFormButtomClickListener();
        setLinkClickSearchListener();
    }

    function setDoubleClickZoomListener() {
        nodes.on("dblclick.zoom", function (d) {
            d3.event.stopPropagation();
            var dcx = (window.innerWidth / 2 - d.x * zoom.scale());
            var dcy = (window.innerHeight / 2 - d.y * zoom.scale());
            zoom.translate([dcx, dcy]);
            graph.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");
        });
    }

    function setMouseOverListener() {
        nodes.on("mouseover", function (d) {
            hoverFocusNode = d;
            addHighlight(d);
        });
    }

    function setMouseOutListener() {
        nodes.on("mouseout", function () {
            hoverFocusNode = null;
            removeHighlight();
        });
    }

    function setMouseDownListener() {
        nodes.on("mousedown", function (node) {
            d3.event.stopPropagation();

            setFocusNode(node);
            setSearchFocusNodesStyle(false);

            if (!clickFocusNode.isFixed) toggleStickyNode();
            if (isPaused) force.stop();

            ButtonOptions.toggleLockIcon(clickFocusNode.isFixed);
        });
    }

    function toggleFocusNeighbouringNodes() {
        if (clickFocusNode != null) {
            if (!clickFocusNode.isFocused) {
                clickFocusNode.isFocused = true;
                setFocus(clickFocusNode);

                if (highlight_node === null) {
                    addHighlight(clickFocusNode);
                }

            } else {
                clickFocusNode.isFocused = false;

                if (highlightTrans < 1) {

                    circle.style("opacity", 1);
                    text.style("opacity", 1);
                    links.style("opacity", 1);
                }

                removeHighlight();
            }
        }

        if (clickFocusNode != null) {
            ButtonOptions.toggleFocusIcon(clickFocusNode.isFocused);
        }
    }

    function setZoomListener() {
        zoom.on("zoom", function () {

            var stroke = nominalStroke;

            if (nominalStroke * zoom.scale() > maxStroke) {
                stroke = maxStroke / zoom.scale();
            }

            links.style("stroke-width", stroke);
            circle.style("stroke-width", stroke);

            var base_radius = nominalBaseNodeSize;
            if (nominalBaseNodeSize * zoom.scale() > maxBaseNodeSize) {
                base_radius = maxBaseNodeSize / zoom.scale();
            }

            circle.attr("d", d3.svg.symbol()
                .size(function (d) {
                    return Math.PI * Math.pow(size(d.size) * base_radius / nominalBaseNodeSize || base_radius, 2);
                })
                .type(function (d) {
                    return d.type;
                }));

            if (!textCenter) text.attr("dx", function (d) {
                return (size(d.size) * base_radius / nominalBaseNodeSize || base_radius);
            });

            var text_size = nominalTextSize;
            if (nominalTextSize * zoom.scale() > maxTextSize) {
                text_size = maxTextSize / zoom.scale()
            }

            text.style("font-size", text_size + "px");
            graph.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });
    }

    function setTickListener() {
        force.on("tick", function () {

            nodes.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            links.attr("x1", function (d) {
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

            nodes.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
        });
    }

    function setResizeListener() {
        d3.select(window).on("resize", resize).on("keydown", bindKeyCode);
    }

    function setDownloadImageListener() {
        d3.select("#downloadImage").on("submit", function () {
            var form = $("#downloadImage");
            var height = parseInt(form.find("#width").val());
            var width = parseInt(form.find("#height").val());

            d3.event.preventDefault();
            generateImage(height, width);
            $('#exportModal').modal('hide');
        });
    }

    function setPauseButtonListener() {
        d3.select(".pause-viz button").on("click", function () {
            togglePause();
        });
    }

    function setFocusButtonListener() {
        d3.select(".focus-highlight button").on("click", function () {
            toggleFocusNeighbouringNodes();
        });
    }

    function setLockButtonListener() {
        d3.select(".lock-node button").on("click", function () {
            toggleStickyNode();
        });
    }

    function setInfoButtonListener() {
        d3.select(".node-info button").on("click", function () {
            if (graphInfoWidget != null && graphInfoWidget.isVisible()) {
                graphInfoWidget.setVisible(false);
            } else {
                triggerSidePanel();
            }
        });
    }

    function setSearchFormButtomClickListener() {
        d3.select('.custom-search-form').on('submit', function () {
            var query = $('.custom-search-form input').val();
            
            d3.event.preventDefault();
            performSearch(query);
        });
    }

    function setLinkClickSearchListener() {
        $(document).on('click', '.widget-search', function(){
            var query = $(event.target).attr('data-query');
            event.preventDefault();

            performSearch(query);
        });
    }

    function performSearch(query) {
        setSearchFocusNodesStyle(false);

        if (query && query != '') {
            populateSearchFocusNodes(query.toLowerCase());
            setSearchFocusNodesStyle(true);
        }
    }

    function togglePause() {
        if (isPaused) {
            force.start();
            isPaused = false;
        } else {
            force.stop();
            isPaused = true;
        }

        ButtonOptions.togglePauseIcon(isPaused);
    }

    function toggleStickyNode() {
        if (clickFocusNode != null) {
            var element = d3.select("id", clickFocusNode.id);
            var domElement = $("[id=" + clickFocusNode.id + "]");

            if (!clickFocusNode.isFixed) {
                element.classed("fixed", clickFocusNode.fixed = true);
                domElement.addClass("fixed");

                clickFocusNode.isFixed = true;
            } else {
                element.classed("fixed", clickFocusNode.fixed = false);
                domElement.removeClass("fixed");

                clickFocusNode.isFixed = false;
            }

            ButtonOptions.toggleLockIcon(clickFocusNode.isFixed);
        }
    }

    function generateImage(height, width) {
        var html = null;

        try {
            !!new Blob();
        } catch (e) {
            alert("Conversion to SVG not supported");
        }

        if (height == 0 && width == 0) {
            html = d3.select("svg")
                .attr("title", "test2")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;
        } else {
            html = d3.select("svg")
                .attr("version", 1.1)
                .attr("height", height)
                .attr("width", width)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;
        }

        var blob = new Blob([html], {type: "image/svg+xml"});
        saveAs(blob, "graph.svg");

    }

    function resize() {
        var width = window.innerWidth, height = window.innerHeight;
        svg.attr("width", width).attr("height", height);

        force.size([force.size()[0] + (width - windowWidth) / zoom.scale(), force.size()[1] + (height - windowHeight) / zoom.scale()]).resume();
        windowWidth = width;
        windowHeight = height;
    }

    function addHighlight(d) {
        svg.style("cursor", "pointer");
        highlight_node = d;

        if (highlightColor != "white") {
            circle.style(toWhite, function (o) {
                return isConnected(d, o) ? highlightColor : "white";
            }).style("z-index", 1000);
            text.style("font-weight", function (o) {
                return isConnected(d, o) ? "bold" : "normal";
            });
            links.style("stroke", function (o) {
                return o.source.index == d.index || o.target.index == d.index ? highlightColor : ((isNumber(o.score) && o.score >= 0) ? color(o.score) : defaultLinkColor);
            }).style("z-index", 1000);
        }
    }

    function removeHighlight() {
        highlight_node = null;

        svg.style("cursor", "move");

        if (highlightColor != "white") {

            circle.style(toWhite, "white")
                .style("z-index", 0);
            text.style("font-weight", "normal");
            links.style("stroke", function (o) {
                return isNumber(o.score) && o.score >= 0 ? color(o.score) : defaultLinkColor
            })
                .style("z-index", 0);
        }
    }

    function populateSearchFocusNodes(query) {

        d3.selectAll('g.node')
            .each(function (d) {
                var name = d.name.toLowerCase();
                if (name.includes(query) || name == query) {
                    searchFocusNodes.push(this);
                }
            });
    }

    function setSearchFocusNodesStyle(isFocused) {

        searchFocusNodes.forEach(function (node) {
            applySearchFocusStyling(isFocused, node);
        });

        if (!isFocused) {
            searchFocusNodes = [];
        }
    }
    
    function applySearchFocusStyling(isApplied, node) {
        var nodeDOM = $("[id=" + node.id + "]");

        if (isApplied) {
            nodeDOM.addClass('search-focus-node');
        } else {
            nodeDOM.removeClass('search-focus-node');
        }
    }

    function setFocusNode(node) {

        if (clickFocusNode != null) {
            $("[id=" + clickFocusNode.id + "]").removeClass("focus-node");
            clickFocusNode.isFocused = false;
        }

        clickFocusNode = node;
        $("[id=" + clickFocusNode.id + "]").addClass("focus-node");
    }

    function setFocus(d) {
        if (highlightTrans < 1) {
            circle.style("opacity", function (o) {
                return isConnected(d, o) ? 1 : highlightTrans;
            });

            text.style("opacity", function (o) {
                return isConnected(d, o) ? 1 : highlightTrans;
            });

            links.style("opacity", function (o) {
                return o.source.index == d.index || o.target.index == d.index ? 1 : highlightTrans;
            });
        }
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    function bindKeyCode() {
        switch (d3.event.keyCode) {
            case 32: // Space bar
                togglePause();
                break;
            case 13: // Enter
                triggerSidePanel(hoverFocusNode);
                break;
            case 67: // C
                toggleFocusNeighbouringNodes();
                break;
            case 83: // S
                toggleStickyNode();
                break;
        }
    }

    function triggerSidePanel(node) {
        if (node != null) {
            graphInfoWidget = new GraphInfoWidget(node.endpoint);
        } else if (clickFocusNode != null) {
            graphInfoWidget = new GraphInfoWidget(clickFocusNode.endpoint);
        }
    }

}).call(this);