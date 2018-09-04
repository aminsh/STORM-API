"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.detailAccount'),
    personView = require('../viewModel.assemblers/view.person'),
    bankView = require('../viewModel.assemblers/view.bank'),
    fundView = require('../viewModel.assemblers/view.fund'),
    translate = require('../services/translateService');


class DetailAccountQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                    .from('detailAccounts').as('baseDetailAccounts')
                    .where('branchId', branchId)
            }).as('baseDetailAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getAllBySubsidiryLedgerAccount(subsidiaryLedgerAccountId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            categories = this.await(knex.select('id')
                .from('detailAccountCategories')
                .where('subsidiaryLedgerAccountIds', 'like', `%${subsidiaryLedgerAccountId}%`));

        if (categories.length == 0)
            return this.getAll(parameters);

        let jointCategories = `%(${categories.asEnumerable().select(e => e.id).toArray().join('|')})%`;


        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .whereRaw(`"detailAccountCategoryIds" similar to '${jointCategories}'`);
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,

            detailAccount = this.await(
                knex.select().from('detailAccounts')
                    .where('branchId', branchId)
                    .andWhere('id', id)
                    .first());

        if (!detailAccount)
            return null;

        let result;

        if (detailAccount.detailAccountType == 'person')
            result = personView(detailAccount);

        else if (detailAccount.detailAccountType == 'bank')
            result = bankView(detailAccount);

        else if (detailAccount.detailAccountType == 'fund')
            result = fundView(detailAccount);

        else result = view(detailAccount);

        let selectedCategories = detailAccount.detailAccountCategoryIds ? detailAccount.detailAccountCategoryIds.split('|') : [],
            allCategories = this.await(knex.select('id', 'title')
                .from('detailAccountCategories')
                .where('branchId', branchId)),
            resultCategories = allCategories.asEnumerable().groupJoin(
                selectedCategories,
                all => all.id,
                selected => selected,
                (all, items) => ({id: all.id, title: all.title, isSelected: items.any()}))
                .toArray();

        result.detailAccountCategories = resultCategories;

        return result;
    }

    remove(id) {
        return this.knex('detailAccounts').where('id', id).del();
    }

    getAllPeople(parameters) {
        return this.getAllByDetailAccountType(parameters, 'person');
    }

    getAllPeopleWithRoleFilter(parameters, personRole) {
        return this.getAllByDetailAccountTypeAndPersonRole(parameters, 'person', personRole);
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

    getAllByDetailAccountTypeAndPersonRole(parameters, type, personRole) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                    .from('detailAccounts')
                    .innerJoin(knex.raw(`(
                            select id, "personRoles", TRIM(pr::TEXT,'""')
                            FROM   "detailAccounts", json_array_elements("personRoles") as pr
                            where "personRoles" is not null
                                    AND TRIM(pr::TEXT,'""') = '${personRole}'
                        )as "role"`),'role.id','detailAccounts.id')
                    .where('branchId', branchId)
                    .where('detailAccountType', type)
                    .as('baseDetailAccounts');
            }).as('baseDetailAccounts');

        return await(kendoQueryResolve(query, parameters, personView));
    }

    getBankAndFundTurnover(id, type, fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            subsidiaryLedgerAccounts = await(knex.from('settings').where('branchId', this.branchId).first())
                .subsidiaryLedgerAccounts,
            subledger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id),

            withQuery = knex.with('journals-row', (qb) => {
                qb.select('detailAccounts.title',
                    knex.raw(`"detailAccounts".title || ' ${translate('Code')} ' || COALESCE("detailAccounts".code,'--') as display`),
                    'journalLines.article',
                    knex.raw(`"journalLines".debtor as debtor`),
                    knex.raw(`"journalLines".creditor as creditor`),
                    'journalLines.detailAccountId',
                    knex.raw('journals."temporaryDate" as date'),
                    knex.raw('journals."temporaryNumber" as number'),
                    knex.raw(`ROW_NUMBER () OVER (ORDER BY "temporaryNumber") as "seq_row"`))
                    .from('journals')
                    .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                    .leftJoin('detailAccounts', 'detailAccounts.id', 'journalLines.detailAccountId')
                    .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
                    .where('detailAccounts.id', id)
                    .modify(modify, branchId, userId, canView, 'journals')
                    .where('journals.periodId', fiscalPeriodId)
                    .where('detailAccounts.detailAccountType', type)
                    .whereIn('subsidiaryLedgerAccounts.id', [subledger.bank, subledger.fund])
            }),

            query = withQuery.select().from(function () {
                this.select('*',
                    knex.raw(`(select sum(debtor - creditor) 
                               from "journals-row" 
                               where "seq_row" <= base."seq_row" and "detailAccountId" = base."detailAccountId") as remainder`))
                    .from('journals-row as base')
                    .groupBy(
                        'title',
                        'display',
                        'article',
                        'debtor',
                        'creditor',
                        'detailAccountId',
                        'date',
                        'number',
                        'seq_row'
                    )
                    .orderBy('base.seq_row', 'desc')
                    .as('baseQuery')
            }),


            view = entity => ({
                title: entity.title,
                article: entity.article,
                debtor: entity.debtor,
                creditor: entity.creditor,
                date: entity.date,
                display: entity.display,
                number: entity.number,
                remainder: entity.remainder,
                row_seq: entity.row_seq
            });

        return this.await(kendoQueryResolve(query, parameters, view));
    }
}

module.exports = DetailAccountQuery;