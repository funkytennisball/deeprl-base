'use strict';

let config = require('../config');
let express = require('express');
let path = require('path');

let app = express();
let redis = require('redis');

let redisClient = redis.createClient();
let server = require('../config/sockets').init(app, redisClient);

// Route
app.use(express.static(path.join(config.rootPath, 'public')));

module.exports = server;
