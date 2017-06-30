"use strict";

const Base = require('./base');

class DimensionCategory extends Base{
    constructor(model){
        super();

        this.title = model.title;
        this.id = model.id;
    }
}

module.exports = DimensionCategory;