'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Environment type
 */
const DEV = process.env.NODE_ENV == 'development';
const PROD = process.env.NODE_ENV == 'production';

/**
 * Configuration
 */
const webpackConfig = {};

/**
 * Entry point for VUE
 */
if (PROD) {
    webpackConfig.entry = './client/index.js';
} else if (DEV) {
    webpackConfig.entry = [
        'webpack-hot-middleware/client?reload=true',
        './client/index.js'
    ];
}

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
 * Resolve
 */
webpackConfig.resolve = {
    alias: {
        'vue': 'vue/dist/vue.common.js',
    },
};

/**
 * Loaders
 */
webpackConfig.module = {
    loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                    // the "scss" and "sass" values for the lang attribute to the right configs here.
                    // other preprocessors should work out of the box, no loader config like this nessessary.
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                },
            },
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
            }
        },
        { 
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }
    ],
};

if (DEV) {
    webpackConfig.plugins = [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'dist/index.html'),
            template: path.join(__dirname, 'client/index.html'),
            inject: true
        })
    ]
}

/**
 * Dev server configs
 */
webpackConfig.devServer = {
    historyApiFallback: true,
    noInfo: true
};

module.exports = webpackConfig;
