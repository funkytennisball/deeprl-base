'use strict';

let logger = require('../core/logger');
let http = require('http');
let socketio = require('socket.io');

module.exports = {
    /**
	 * Init Socket.IO module and load socket handlers 
	 * 
	 * @param  {Object} app Express App
	 */
    init(app, redisClient) {
        let server = http.createServer(app);
        let io = socketio(server);

        // TODO: set this in config, + global config file
        redisClient.on('message', function(channel, data){
            io.emit('cartpole-data', data);
        });

        redisClient.subscribe('DeepRL-Cartpole-Channel');

        return server;
    }
}
