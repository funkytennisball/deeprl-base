/* globals io, d3, d3charts */

'use strict';

$(function() {
    var socket = io();
    var chartData = [];

    var chart = nv.models.lineChart()
                    .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                    .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                    .transitionDuration(350)  //how fast do you want the lines to transition?
                    .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                    .showYAxis(true)        //Show the y-axis
                    .showXAxis(true)        //Show the x-axis
    ;

    chart.xAxis     //Chart x-axis settings
        .axisLabel('Generations');
    
    chart.yAxis
        .axisLabel('Ticks');

    var tick = function(){
        d3.select('svg')
            .datum(chartData)
            .call(chart);
    }

    socket.on('cartpole-data', function(data){
        chartData = JSON.parse(data.replace(/b/g, '').replace(/'/g, '"'));

        tick();
    });
});
