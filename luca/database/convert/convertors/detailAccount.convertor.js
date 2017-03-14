"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DetailAccount = require('../models/detailAccount');

class DetailAccountConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let details = await(this.sql.query('select * from detail'));

        data.detailAccounts = details.asEnumerable()
            .select(d => new DetailAccount(d))
            .toArray();

        _util.idGenerator(data.detailAccounts);
    }
}

module.exports = DetailAccountConvertor;