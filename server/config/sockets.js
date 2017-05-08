'use strict';

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
        redisClient.on('update', function(channel, message){
            console.log(message);
            redisClient.hgetall('DeepRL-Cartpole', function(err, object){
                io.emit('cartpole-data', object);
            });
        });

        redisClient.subscribe('DeepRL-Cartpole-Channel');

        return server;
    }
}