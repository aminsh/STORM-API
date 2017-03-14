"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Cheque = require('../models/cheque'),
    Enumerable = require('linq');

class ChequeConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let chequeCategories = data.chequeCategories,
            cheques = [];

        data.cheques = [];

        chequeCategories.forEach(category => {
            cheques = Enumerable.range(
                category.firstPageNumber,
                category.totalPages)

                .select(number => new Cheque(
                    number,
                    category.id,
                    this.findDocumentByChequeNumber(number)))
                    
                .toArray();

            data.cheques = data.cheques.concat(cheques);
        });

        _util.idGenerator(data.cheques);

    }

    findDocumentByChequeNumber(number) {
        let document = await(this.sql
            .query(`select * from document where Cheque = '${number}'`));

        return (document && document.length > 0)
            ? document[0]
            : null;
    }
}

module.exports = ChequeConvertor;