var config = require('../config'),
    path = require('path'),
    fs = require('fs');

module.exports.getDirectoryFiles = (relativePath)=> {
    return fs.readdirSync(path.normalize(`${config.rootPath}/server/${relativePath}`));
};

