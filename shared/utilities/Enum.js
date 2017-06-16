"use strict";

module.exports = class {
    constructor(enums) {
        this.data = enums;
    }

    getDisplay(key) {
        if (!key)return '';

        return this.data
            .asEnumerable()
            .single(e => e.key == key)
            .display;
    }

    getKey(key) {
        return this.data
            .asEnumerable()
            .single(e => e.key == key);
    }

    getKeys() {
        return this.data.asEnumerable()
            .select(e => e.key)
            .toArray();
    }
};