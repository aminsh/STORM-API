"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.detailAccount'),
    personView = require('../viewModel.assemblers/view.person'),
    bankView = require('../viewModel.assemblers/view.bank'),
    fundView = require('../viewModel.assemblers/view.fund');


module.exports = class DetailAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId);
        }).as('baseDetailAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let detailAccount = await(
            this.knex.select().from('detailAccounts')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());

        if (!detailAccount)
            return null;

        if (detailAccount.detailAccountType == 'person')
            return personView(detailAccount);

        if (detailAccount.detailAccountType == 'bank')
            return bankView(detailAccount);

        if (detailAccount.detailAccountType == 'fund')
            return fundView(detailAccount);

        return view(detailAccount);
    }

    remove(id) {
        return this.knex('detailAccounts').where('id', id).del();
    }

    getAllPeople(parameters) {
        return this.getAllByDetailAccountType(parameters, 'person');
    }

    getAllBanks(parameters) {
        return this.getAllByDetailAccountType(parameters, 'bank');
    }

    getAllFunds(parameters) {
        return this.getAllByDetailAccountType(parameters, 'fund');
    }

    getAllOthers(parameter) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .whereNull('detailAccountType')
                .as('baseDetailAccounts');
        }).as('baseDetailAccounts');

        return kendoQueryResolve(query, parameter, view);
    }

    getAllByDetailAccountType(parameters, type) {
        let knex = this.knex,
            branchId = this.branchId,
            views = {personView, bankView, fundView};

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .andWhere('detailAccountType', type)
                .as('baseDetailAccounts');
        }).as('baseDetailAccounts');


        return kendoQueryResolve(query, parameters, views[`${type}View`]);
    }

    getAllSmallTurnoverById(id, type, fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.from(function () {
                this.select(
                    'detailAccounts.title',
                    'journalLines.article',
                    'journalLines.debtor',
                    'journalLines.creditor',
                    knex.raw('journals."temporaryDate" as date'))
                    .from('detailAccounts')
                    .leftJoin('journalLines', 'detailAccounts.id', 'journalLines.detailAccountId')
                    .leftJoin('journals', 'journals.id', 'journalLines.journalId')
                    .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
                    .where('detailAccounts.id', id)
                    .andWhere('detailAccounts.branchId', branchId)
                    .andWhere('journals.periodId', fiscalPeriodId)
                    .andWhere('detailAccounts.detailAccountType', type)
                    .whereIn('subsidiaryLedgerAccounts.code', ['1101','1103'])
                    .orderBy('journals.temporaryNumber', 'desc')
                    .as('base');

            }),
            view = entity => ({
                title: entity.title,
                article: entity.article,
                debtor: entity.debtor,
                creditor: entity.creditor,
                date: entity.date
            });

        return kendoQueryResolve(query, parameters, view);
    }
};