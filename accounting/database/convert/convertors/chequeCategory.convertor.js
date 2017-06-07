"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    ChequeCategory = require('../models/chequeCategory');

class ChequeCategoryConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let chequeBox = await(this.sql.query('select * from CheqBox ')),
            bankId = data.banks[0].id;

        data.chequeCategories = chequeBox.asEnumerable()
            .select(ch => new ChequeCategory(ch, bankId, this.getDetailAccountId(ch.CBcode3)))
            .toArray();

        _util.idGenerator(data.chequeCategories);
    }

    getDetailAccountId(code) {
        try {
            return data.detailAccounts.asEnumerable()
                .first(d=> d.code == code).id;
        }
        catch (e) {
            return null;
        }
    }
}

module.exports = ChequeCategoryConvertor;