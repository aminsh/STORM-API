"use strict";

var fileSystemServer = require('./server/services/fileSystemService'),
    path = require('path'),
    basePath = './initializers';

fileSystemServer.getDirectoryFiles('./initializers')
    .sort()
    .forEach(file => {
        var run = require(`./server/initializers/${file.replace(path.extname(), '')}`);

        if (typeof run == 'function')
            run();
    });
