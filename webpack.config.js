'use strict';

const path = require('path');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     */
    // const PROD = !!options.PROD;
    // const DEV = !!options.DEV;

    /**
     * Configuration
     */
    const webpackConfig = {};

    /**
     * Entry point for VUE
     */
    webpackConfig.entry = './client/index.js';

    /**
     * Output
     * where should the compiled file go?
     */
    webpackConfig.output = {
        path: path.join(__dirname, '/dist'),
        filename: 'build.js',
        publicPath: '/'
    };

    /**
     * Loaders
     */
    webpackConfig.module = {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    };

    return webpackConfig;
};
