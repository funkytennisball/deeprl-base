'use strict';

const path = require('path');

module.exports = function makeWebpackConfig() {
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
        loaders: [
            {
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
            }
        ],
    };

    /**
     * Dev server configs
     */
    webpackConfig.devServer = {
        historyApiFallback: true,
        noInfo: true
    };

    return webpackConfig;
};
