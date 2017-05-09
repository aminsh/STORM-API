var eventEmitter = require('../eventEmitter');

module.exports.publish = function (name, message) {
    eventEmitter.emit('message', message);
};
