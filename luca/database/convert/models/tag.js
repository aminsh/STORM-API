"use strict";

const Base = require('./base');

class Tag extends Base{
    constructor(model){
        super();

        this.id = model.ID;
        this.title = model.Des;
    }
}

module.exports = Tag;