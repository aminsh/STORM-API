"use strict";

let ModelBase = require('../utilities/modelBase'),
    Dimension = require('./dimension');

class DimensionCategory extends ModelBase {

    get title() {
        return 'STRING';
    }

    get dimensions() {
        return [Dimension];
    }
}

module.exports = DimensionCategory;
