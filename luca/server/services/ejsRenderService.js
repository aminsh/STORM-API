var ejs = require('ejs');
var Promise = require('promise');
var config = require('../config/config');
var _ = require('lodash');
var path = require('path');

function renderFile(fileName, data) {
    var defaultData = {
        staticRootPath: "file:///{0}".format(config.rootPath)
    };

    data = _.assign(defaultData, data);

    fileName = path.normalize('{0}/{1}'.format(config.reportPath, fileName));

    return new Promise(function (resolve, reject) {
        ejs.renderFile(fileName, data, function (err, html) {
            if (err)
                return reject(err);

            resolve(html);
        });
    });
}

module.exports.renderFile = renderFile;