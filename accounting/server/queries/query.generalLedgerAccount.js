"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.generalLedgerAccount'),
    Enums = instanceOf('Enums'),
    SubdidiaryLedgerAccountQuery = require('./query.subsidiaryLedgerAccount');

class GeneralLedgerAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw("*,code || ' ' || title as display"))
                .from('generalLedgerAccounts')
                .where('branchId', branchId)
                .as('baseGeneralLedgerAccounts');
        }).as('baseGeneralLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    chartOfAccount() {
        const subsidiaryLedgerAccountQuery = new SubdidiaryLedgerAccountQuery(this.branchId),
            groups = await(this.knex.select('*').from('accountCategories').where('branchId', this.branchId)),
            generalLedgerAccounts = await(this.getAll()).data,
            subsidiaryLedgerAccounts = await(subsidiaryLedgerAccountQuery.getAll()).data;

        return groups.asEnumerable()
            .select(g => ({
                key: g.key,
                display: g.display,
                generalLedgerAccounts: generalLedgerAccounts.asEnumerable()
                    .where(gla => gla.groupingType === g.key)
                    .select(gla => ({
                        id: gla.id,
                        display: gla.display,
                        subsidiaryLedgerAccounts: subsidiaryLedgerAccounts.asEnumerable()
                            .where(sla => sla.generalLedgerAccountId === gla.id)
                            .select(sla => ({
                                id: sla.id,
                                display: sla.account
                            }))
                            .toArray()
                    }))
                    .toArray()
            }))
            .toArray();
    }

    getById(id) {
        let generalLedgerAccount = await(
            this.knex.table('generalLedgerAccounts')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());
        return view(generalLedgerAccount);
    }
};

module.exports = GeneralLedgerAccountQuery;