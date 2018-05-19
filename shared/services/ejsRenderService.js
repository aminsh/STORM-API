"use strict";

const ejs = require('ejs'),
    Promise = require('promise'),
    config = instanceOf('config'),
    path = require('path');

function renderFile(fileName, data) {
    const defaultData = {
        staticRootPath: `${config.url.origin}/public`,
        config
    };

    data = Object.assign(defaultData, data);

    fileName = path.normalize(`${config.rootPath}/${fileName}`);

    return new Promise(function (resolve, reject) {
        ejs.renderFile(fileName, data, function (err, html) {
            if (err)
                return reject(err);

            resolve(html);
        });
    });
}

module.exports.renderFile = renderFile;