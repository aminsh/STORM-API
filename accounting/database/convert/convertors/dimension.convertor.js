"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Dimension = require('../models/dimension');

class DimensionConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        data.dimensions = [];

        data.dimensionCategories.forEach((cat, i) => {
            let items = await(this.sql.query(`select * from ${this.sourceTableNames[i]}`));
            data.dimensions = data.dimensions
                .concat(items.asEnumerable()
                    .select(item => new Dimension(item, { index: i, id: cat.id }))
                    .toArray());
        });

        _util.idGenerator(data.dimensions);
    }

    get sourceTableNames() {
        return[
            'CostCenter',
            'tblCode5',
            'tblCode6'
        ]
    }
}

module.exports = DimensionConvertor;

