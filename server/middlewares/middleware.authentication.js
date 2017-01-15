var config = require('../config'),
    routeHandler = require('../utilities/routeHandler'),
    indexRouter = require('../routes')
        .asEnumerable()
        .single(r => r.method.toLowerCase() == 'get' && r.path == '/');

module.exports = (req, res, next) => {
    const authenticationService = req.ioc.resolve('authenticationService');

    authenticationService.middleware();
};
