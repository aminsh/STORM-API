"use strict";

let fs = require('fs'),
    util = require('util'),
    log_file,
    log_stdout = process.stdout;


function createNewFile() {
    var now = new Date,
        fileName = `${__dirname}/data/logs/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}.log`;

    if (fs.existsSync(fileName) && log_file)
        return;

    log_file = fs.createWriteStream(fileName, { flags: 'w' });

}

console.log = function (d) { //
    createNewFile();

    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

require('babel-polyfill');

require('./dist/bootstrap');


