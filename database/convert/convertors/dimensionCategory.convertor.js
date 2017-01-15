"use strict";

const
    data = require('../models/data'),
    async = require('asyncawait/async'),
    DimensionCategory = require('../models/dimensionCategory'),
    _util = require('../_util');

class DimensionCategoryConvertor {
    constructor() {
        this.execute = async(this.execute);
    }

    execute() {
        data.dimensionCategories = this.categoryNames.asEnumerable()
            .select(n => new DimensionCategory(n))
            .toArray();

        _util.idGenerator(data.dimensionCategories);
    }

    get categoryNames() {
        return [
            'تفصیل 2',
            'تفصیل 3',
            'تفصیل 4'
        ];
    }
}

module.exports = DimensionCategoryConvertor;