"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    SubsidiaryLedgerAccount = require('../models/subsidiaryLedgerAccount');

class SubsidiaryLedgerAccountConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let subLedgers = await(this.sql.query('select * from SubLedger'));

        data.subsidiaryLedgerAccounts = subLedgers.asEnumerable()
            .select(s => new SubsidiaryLedgerAccount(
                s,
                this.getGeneralLedgerAccountId(s.code1)))
            .toArray();

        _util.idGenerator(data.subsidiaryLedgerAccounts);
    }

    getGeneralLedgerAccountId(code) {
        let generalLedgerAccounts = data.generalLedgerAccounts;

        return generalLedgerAccounts.asEnumerable()
.first(g => g.code == code).id;
}
}

module.exports = SubsidiaryLedgerAccountConvertor;