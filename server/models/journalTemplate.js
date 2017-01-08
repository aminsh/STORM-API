"use strict";

let ModelBase = require('../utilities/modelBase');

class JournalTemplate extends ModelBase {
    get title() {
        return 'STRING';
    }
    get data() {
        return 'TEXT';
    }
}

module.exports = JournalTemplate;
