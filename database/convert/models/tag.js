"use strict";

const Base = require('./base'),
    _util = require('../_util');

class Tag extends Base{
    constructor(model){
        super();

        this.id = _util.newGuid();
        this.referenceId = model.ID;
        this.title = model.Des;
    }
}

module.exports = Tag;