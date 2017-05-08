/* globals io */

'use strict';

$(function() {
    var socket = io();
    
    socket.on('cartpole-data', function(data){
        console.log(data);
    });
});
