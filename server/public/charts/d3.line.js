/* globals d3 */

'use strict';

var d3charts = d3charts || {};

d3charts.line = function() {
    // Default settings
    var $el;
    var width = 960;
    var height = 500;
    var color = "steelblue";
    var margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 30
    };
    var data = [];
    var svg, y, xAxis, yAxis, line;
    var x = d3.scale.linear().range([0, width]);

    var object = {};

    // Method for render/refresh graph
    object.render = function() {
        if (!svg) { // Render first time
            y = d3.scale.linear()
                .range([height, 0]);

            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            line = d3.svg.line()
                .x(function(d) {
                    return x(d.x);
                })
                .y(function(d) {
                    return y(d.y);
                })
                .interpolate("basis");

            svg = $el.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(d3.extent(data, function(d) {
                return d.x;
            }));
            y.domain(d3.extent(data, function(d) {
                return d.y;
            }));

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("stroke", color)
                .attr("d", line);
        } else { //Refresh
            object.data(data);
            x.domain(d3.extent(data, function(d) {
                return d.x;
            }));
            y.domain(d3.extent(data, function(d) {
                return d.y;
            }));

            svg.select("g.y")
                .transition()
                .duration(1000)
                .call(yAxis);

            svg.select("g.x")
                .transition()
                .duration(1000)
                .call(xAxis);

            svg.selectAll("path.line")
                .datum(data)
                .transition()
                .duration(1000)
                .attr("d", line);
        }
        return object;
    };

    // Getter and setter methods
    object.data = function(value) {
        if (!arguments.length) {
            return data;
        }

        data = value;
        return object;
    };

    object.$el = function(value) {
        if (!arguments.length) {
            return $el;
        }
        $el = value;
        return object;
    };

    object.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return object;
    };

    object.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return object;
    };

    object.color = function(value) {
        if (!arguments.length) {
            return color;
        }
        color = value;
        return object;
    };
    object.x = function(value) {
        if (!arguments.length) {
            return x;
        }
        x = value;
        return object;
    };
    return object;
};
