'use strict';

let config = require('./config');
let logger = require('./core/logger');
let moment = require('moment');
let chalk = require('chalk');

logger.info();
logger.info(chalk.bold("---------------------[ Server starting at %s ]---------------------------"), moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
logger.info();
logger.info(chalk.bold("Application root path: ") + config.rootPath);

// Start init
let app = require('./core/express');

app.listen(config.port, function () {
    logger.info('Server running at port: ' + chalk.green(config.port));
});
