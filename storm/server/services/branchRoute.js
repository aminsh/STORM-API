"use strict";

module.exports = (req, res, next)=> {
    if (req.originalUrl.includes('branch/change')) {
        res.cookie('return-url', req.query.returnUrl);
        res.redirect('/branch/choose/auth');
        return true;
    }

    return false;
};