"use strict";

const Mssql = require('../connection/mssql'),
    _util = require('../_util'),
    data = require('../models/data'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalLine = require('../models/journalLine');

class JournalLineConvertor {
    constructor() {
        this.sql = new Mssql;

        this.execute = async(this.execute);
    }

    execute() {
        let journals = data.journals;


        journals.forEach(j => {
            let documents = await(this.sql
                .query(`select *,ROW_NUMBER() OVER(ORDER BY radif) as row
                from document where id = ${j.referenceId}`));


            data.journalLines = (data.journalLines || []).concat(documents.asEnumerable()
                .select(d => new JournalLine(d, j.id, this.getAccount({
                    code1: d.code1,
                    code2: d.code2,
                    code3: d.code3,
                    code4: d.code4,
                    code5: d.code5,
                    code6: d.code6
                })))
                .toArray());
        })
    }

    getAccount(accountCode) {
        let generalLedgerAccountId = this.getGeneralLedgerAccountId(accountCode.code1),
            subsidiaryLedgerAccountId = this.getSubsidiaryLedgerAccountId(
                generalLedgerAccountId,
                accountCode.code2),
            detailAccountId = this.getDetailAccountId(accountCode.code3),
            dimensionCategories = data.dimensionCategories,
            dimension1Id = this.getDimensionId(dimensionCategories[0].id, accountCode.code4),
            dimension2Id = this.getDimensionId(dimensionCategories[1].id, accountCode.code5),
            dimension3Id = this.getDimensionId(dimensionCategories[2].id, accountCode.code6);

        return {
            generalLedgerAccountId,
            subsidiaryLedgerAccountId,
            detailAccountId,
            dimension1Id,
            dimension2Id,
            dimension3Id
        }
    }

    getGeneralLedgerAccountId(code) {
        return data.generalLedgerAccounts.asEnumerable().first(g => g.code == code).id;
    }

    getSubsidiaryLedgerAccountId(generalLedgerAccountId, code) {
        return data.subsidiaryLedgerAccounts.asEnumerable()
            .first(s => s.code == code && s.generalLedgerAccountId == generalLedgerAccountId).id;
    }

    getDetailAccountId(code) {
        if (!code) return null;

        return data.detailAccounts.asEnumerable().first(d => d.code == code).id;
    }

    getDimensionId(dimensionCategoryId, code) {
        try {
            if (!code) return null;

            return data.dimensions.asEnumerable()
                .first(c => c.code == code && c.dimensionCategoryId == dimensionCategoryId).id;
        }
        catch (e) {
            return null;
        }
    }
}

module.exports = JournalLineConvertor;