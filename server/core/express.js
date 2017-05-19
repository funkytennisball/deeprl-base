'use strict';

let config = require('../config');
let express = require('express');
let path = require('path');
let webpack = require('webpack');

let app = express();
let redis = require('redis');

let redisClient = redis.createClient();
let server = require('../config/sockets').init(app, redisClient);


// Hot middleware
if(config.isDevMode()){
    let compiler = webpack(config.webpackConfig);

    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: config.webpackConfig.output.publicPath,
      stats: {
        colors: true
      }
    }));
    
    app.use(require('webpack-hot-middleware')(compiler));

    app.get('/', (req, res) => {
        res.sendFile(path.join(config.rootPath, 'dist', 'index.html'));
    });
} else if (config.isProdMode()){
    app.use(express.static(path.join(config.rootPath, 'dist')));
}

// Root
// app.get('/', function(req, res){
//     res.sendFile(path.join(config.rootPath, 'client', 'index.html'));
// });

module.exports = server;
