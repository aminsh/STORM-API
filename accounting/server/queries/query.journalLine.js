"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.journalLine'),
    journalLineBase = require('./query.jounalLine.base');

class JournalLineQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
        this.getAll = async(this.getAll);
        this.getById = async(this.getById);
    }

    getAll(journalId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify;

        let query = knex.select()
            .from(function () {
                journalLineBase.call(this, knex, branchId, userId, canView, modify);
            })
            .where('journalId', journalId);

        let result = this.await(kendoQueryResolve(query, parameters, view)),
            aggregates = this.await(knex.select(knex.raw('SUM("debtor") as "sumDebtor", SUM("creditor") as "sumCreditor"'))
                .from('journalLines')
                .modify(modify, branchId, userId, canView)
                .andWhere('journalId', journalId).first());

        result.aggregates = {
            debtor: {sum: aggregates.sumDebtor},
            creditor: {sum: aggregates.sumCreditor}
        };

        return result;
    }

    getAllByJournalId(journalId) {

        let journalLine = await(this.knex.select()
            .from('journalLines')
            .where('branchId', this.branchId)
            .andWhere('journalId', journalId));
        return journalLine;
        /*let knex = this.knex;
        return knex.select()
            .from(function () {
                journalLineBase.call(this, knex);
            })
            .where('journalId', journalId)*/
    }

    getById(id) {
        let journalLine = await(
            this.knex.select()
                .from('journalLines')
                .where('branchId', this.branchId)
                .andWhere('id', id).first());
        return view(journalLine);
    }
}

module.exports = JournalLineQuery;