"use strict";

const fileSystemServer = require('./server/services/fileSystemService'),
    path = require('path');

fileSystemServer.getDirectoryFiles('./initializers')
    .sort()
    .forEach(file => {
        var run = require(`./server/initializers/${file.replace(path.extname(), '')}`);

        if (typeof run == 'function')
            run();
    });
