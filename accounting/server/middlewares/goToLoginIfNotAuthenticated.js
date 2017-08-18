"use strict";

module.exports = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    if (req.xhr)
        return res.status(401).send('user is not authenticated');

    let url = `/login?returnUrl=${req.originalUrl}`;
    return res.redirect(url);
};
