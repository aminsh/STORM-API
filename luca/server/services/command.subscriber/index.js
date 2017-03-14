var config = require('../../config/config');

module.exports = config.messageQueue == 'none'
    ? require('./implemented.by.eventEmitter')
    : require('./implemented.by.redis');
