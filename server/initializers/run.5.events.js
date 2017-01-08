var eventEmitter = require('../services/eventEmitter'),
    fileSystemService = require('../services/fileSystemService'),
    basePath = '/events';

module.exports = ()=> {
    fileSystemService.getDirectoryFiles(basePath)
        .forEach(file => {
            var event = require(`../${basePath}/${file}`);
            eventEmitter.on(event.name, event.action);
        });
};