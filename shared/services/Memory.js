"use strict";

const mCache = require('memory-cache');

class Memory {

    get(key) {
        return mCache.get(key);
    }

    set(key, value, time) {
        mCache.put(key, value, time,
            (key, value) => console.log(`key => ${key} with value => ${value} deleted`));
    }

    remove(key) {
        return mCache.del(key);
    }
}

module.exports = Memory;