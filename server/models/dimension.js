"use strict";

let ModelBase = require('../utilities/modelBase'),
    DimensionCategory = require('./dimensionCategory');

class Dimension extends ModelBase {
    get code() {
        return 'STRING';
    }

    get title() {
        return 'STRING';
    }

    get description() {
        return 'STRING';
    }
    get isActive() {
        return 'BOOLEAN';
    }

    get category() {
        return DimensionCategory;
    }
}

module.exports = Dimension;
