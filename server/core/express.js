'use strict';

let config = require('../config');
let express = require('express');
let path = require('path');

let app = express();
let redis = require('redis');

let redisClient = redis.createClient();
let server = require('../config/sockets').init(app, redisClient);

// Static
app.use(express.static(path.join(config.rootPath, 'dist')));

// Root
app.get('/', function(req, res){
    res.sendFile(path.join(config.rootPath, 'client', 'index.html'));
});

module.exports = server;
