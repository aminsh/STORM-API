"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.journalLine'),
    journalLineBase = require('./query.jounalLine.base');

module.exports = class JournalLineQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getAll = async(this.getAll);
        this.getById = async(this.getById);
    }

    getAll(journalId, parameters) {
        let knex = this.knex;
        let query = knex.select()
            .from(function () {
                journalLineBase.call(this, knex);
            })
            .where('journalId', journalId);

        let result = await(kendoQueryResolve(query, parameters, view));

        var aggregates = await(knex.select(knex.raw('SUM("debtor") as "sumDebtor", SUM("creditor") as "sumCreditor"'))
            .from('journalLines')
            .where('journalId', journalId).first());

        result.aggregates = {
            debtor: { sum: aggregates.sumDebtor },
            creditor: { sum: aggregates.sumCreditor }
        };

        return result;
    }

    getById(id) {
        let journalLine = await(this.knex.select().from('journalLines').where('id', id).first());
        return view(journalLine);
    }
};