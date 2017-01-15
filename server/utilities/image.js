"use strict";

const fs = require('fs');

module.exports = {
    toBase64(filename){
        let bitmap = fs.readFileSync(filename);
        return `data:image/jpeg;base64,${new Buffer(bitmap).toString('base64')}`;
    }
};