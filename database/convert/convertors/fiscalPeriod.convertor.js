"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriod = require('../models/fiscalPeriod');

class FiscalPeriodConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let years = await(this.sql.query('select * from Years'));

        data.fiscalPeriods = years.asEnumerable()
            .select(y => new FiscalPeriod(y.year))
            .toArray();

        _util.idGenerator(data.fiscalPeriods);
    }
}

module.exports = FiscalPeriodConvertor;