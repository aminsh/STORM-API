"use strict";

const Base = require('./base');

class JournalTag extends Base {
    constructor(model) {
        super();

        this.journalId = model.journalId;
        this.tagId = model.tagId;
    }
}

module.exports = JournalTag;