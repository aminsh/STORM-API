var eventEmitter = require('../eventEmitter');

module.exports.on = function (name, action) {
    eventEmitter.on('message', action);
};

module.exports.subscribe = function (name) {
    // no need for event emitter
}
