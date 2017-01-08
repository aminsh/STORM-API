var config = require('../config'),
    routeHandler = require('../utilities/routeHandler'),
    indexRouter = require('../routes')
        .asEnumerable()
        .single(r => r.method.toLowerCase() == 'get' && r.path == '/');

module.exports = (req, res, next)=> {
    if (req.isAuthenticated()) {
        if (req.xhr) return next();
        if(req.originalUrl.startsWith('/logo')) return next();

        return routeHandler(req, indexRouter.handler)
    }

    if (req.originalUrl.startsWith('/auth/return'))
        return next();

    if (req.xhr)
        return res.status(401).send('user is not authenticated');

    var url = `${config.auth.url}/?returnUrl=${config.auth.returnUrl}`;

    return res.redirect(url);
};
