var ioc = require('../utilities/ioc');
var register = require('../config/config.ioc');

module.exports = function (req, res, next) {
    //res.cookie('branch-id', 333);

    var instance = new ioc(req, res);
    req.ioc = instance;

    register(instance, req, res);

    next();
};