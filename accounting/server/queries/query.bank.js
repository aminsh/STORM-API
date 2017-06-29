"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = bank => ({id: bank.id, title: bank.title});

class BandQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(id, fiscalPeriodId, parameters) {
        let knex = this.knex,
            bank = await(this.knex.select(knex.raw(`"detailAccounts".title, "journalLines".article, "journalLines".debtor, 
                "journalLines".creditor`))
                .from('detailAccounts')
                .leftJoin('journalLines', 'detailAccounts.id', 'journalLines.detailAccountId')
                .leftJoin('journals', 'journals.id', 'journalLines.journalId')
                .where('detailAccounts.id', id)
                .andWhere('branchId', this.branchId)
                .andWhere('journals.periodId', fiscalPeriodId)
                .andWhere('detailAccounts.detailAccountType', 'bank')
            );
        return kendoQueryResolve(bank, parameters, view);
    }


    getById(id) {
        let bank = await(this.knex.select()
            .from('detailAccounts')
            .where('id', id)
            .andWhere('branchId', this.branchId)
            .first()
        );
        return view(bank);
    }
}

module.exports = BandQuery;