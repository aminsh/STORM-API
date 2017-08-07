var fs = require('fs');
var config = require('../config');

function exceptionHandler(err, req, res, next) {
    debugger;
    Raven.captureException('تست سرور');
    next();
}

module.exports = exceptionHandler;