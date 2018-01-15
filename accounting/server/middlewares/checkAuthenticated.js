"use strict";

const async = require('asyncawait/async'),
    /** @type {UserQuery}*/
    UserQuery = instanceOf('UserQuery');

module.exports = async(function (req, res, next) {

    const userKey = req.cookies['USER-KEY'];

    if(!userKey)
        return userIsNotAuthenticatedAction(req, res);

    let user = UserQuery.getByToken(userKey);

    if(!user)
        return userIsNotAuthenticatedAction(req, res);

    req.user = user;

    return next()

});

function userIsNotAuthenticatedAction(req, res) {
    const url = `/login?returnUrl=${req.originalUrl}`;

    if(req.xhr)
        return res.status(401).send('user is not authenticated');

    return res.redirect(url);
}