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
        redisClient.on('message', function(channel, message){
            redisClient.hgetall('DeepRL-Cartpole', function(err, object){
                if(!err){
                    console.log(object);
                    io.emit('cartpole-data', object);
                } else {
                    logger.error(err);
                }
            });
        });

        redisClient.subscribe('DeepRL-Cartpole-Channel');

        return server;
    }
}
