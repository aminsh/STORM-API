"use strict";

const eventEmitter = require('../services/eventEmitter'),
    fileSystemService = require('../services/fileSystemService'),
    basePath = '/events',
    redisClient = require('../services/redisClientService');

module.exports = ()=> {
    fileSystemService.getDirectoryFiles(basePath)
        .forEach(file => {
            var event = require(`../${basePath}/${file}`);
            eventEmitter.on(event.name, event.action);
        });

     redisClient.on('message',
         (channel, message)=> eventEmitter.emit(channel, JSON.parse(message)));

    redisClient.subscribe('on-branch-created');
    redisClient.subscribe('on-branch-updated');
};