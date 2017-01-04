"use strict";

let ignorableUrls = [
    '/uploads',
    'logo'
];

module.exports = (req, res, next)=> {
    if(ignorableUrls.asEnumerable().any(u=> req.originalUrl.includes(u))){
        next();
        return true;
    }

    if(req.xhr){
        next();
        return true;
    }
};