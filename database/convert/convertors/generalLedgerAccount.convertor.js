"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    GeneralLedgerAccount = require('../models/generalLedgerAccount');

class GeneralLedgerAccountConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let ledgers = await(this.sql.query('select * from ledger'));

        data.generalLedgerAccounts = ledgers.asEnumerable()
            .select(l => new GeneralLedgerAccount(l))
            .toArray();

        _util.idGenerator(data.generalLedgerAccounts)
    }
}

module.exports = GeneralLedgerAccountConvertor;