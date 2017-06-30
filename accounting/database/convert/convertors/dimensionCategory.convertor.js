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
    }

    get categoryNames() {
        return [
            {id: '1', title: 'تفصیل 2'},
            {id: '2', title: 'تفصیل 3'}
        ];
    }
}

module.exports = DimensionCategoryConvertor;