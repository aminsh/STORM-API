var fs = require('fs');
var config = require('../config/config');

function exceptionHandler(err, req, res, next) {
    debugger;

    next();
}

module.exports = exceptionHandler;