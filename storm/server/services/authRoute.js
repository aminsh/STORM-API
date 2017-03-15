"use strict";

module.exports = (req, res, next)=> {
    if (!req.originalUrl.startsWith('/auth'))
        return false;

    res.cookie('return-url', req.query.returnUrl);

    if (!req.isAuthenticated()) {
        res.redirect('/login/auth');
        return true;
    }

    let branchId = req.cookies['branch-id'];

    if (!branchId) {
        res.redirect('/branch/choose/auth');
        return true;
    }

    let token = branchId && req.cookies['return-url']
        ? require('../queries/query.token').authToken(req.user, branchId)
        : null;

    let returnUrl = token
        ? '{0}/?token={1}'.format(req.cookies['return-url'], token)
        : null;

    if (returnUrl) {
        res.redirect(returnUrl);
        return true;
    }

    return false;
};