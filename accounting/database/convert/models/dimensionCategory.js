"use strict";

const Base = require('./base');

class DimensionCategory extends Base{
    constructor(title){
        super();

        this.title = title;
    }
}

module.exports = DimensionCategory;