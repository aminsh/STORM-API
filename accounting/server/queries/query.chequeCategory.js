"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.chequeCategory');

class ChequeCategoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            let selectExp = knex.raw('"chequeCategories".*, "detailAccounts".code || \' \' || "detailAccounts".title as "bankDisplay"');

            this.select(selectExp)
                .from('chequeCategories')
                .leftJoin('detailAccounts', 'chequeCategories.bankId', 'detailAccounts.id')
                .where('chequeCategories.branchId', branchId)
                .as('base');
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getOpens(detailAccountId) {
        let knex = this.knex;
        let selectExp = ' "id","totalPages", "firstPageNumber", "lastPageNumber", ';
        selectExp += '(SELECT "count"(*) from cheques where "chequeCategoryId" = "baseChequeCategories".id ' +
            'AND "status"=\'White\') as "totalWhiteCheques"';

        return knex.select(knex.raw(selectExp))
            .from(knex.raw('"chequeCategories" as "baseChequeCategories"'))
            .where('branchId', this.branchId)
            .andWhere('isClosed', false)
            .andWhere('detailAccountId', detailAccountId)
            .as("baseChequeCategories");
    }

    getById(id) {
        let category = await(
            this.knex.table('chequeCategories')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());
        return view(category);
    }

    getCheque(bankId) {
        let firstOpenCategory = await(
            this.knex.table('chequeCategories')
                .where('branchId', this.branchId)
                .where('isClosed', false)
                .where('bankId', bankId)
                .orderBy('createdAt')
                .first());

        if (!firstOpenCategory)
            return 'NULL';

        let cheque = firstOpenCategory.cheques.asEnumerable()
            .orderBy(item => item.number)
            .first(item => !item.isUsed);

        return cheque.number;
    }

    getAllCheques(id) {
        let knex = this.knex,
            category = await(knex.select('cheques').from('chequeCategories').where({id}).first()),
            chequesUsed = category.cheques
                .asEnumerable()
                .where(item => item.isUsed && item.treasuryPayableChequeId)
                .toArray(),

            treasuryPayableCheques = chequesUsed && chequesUsed.length
                ? await(
                    knex.select(
                        'treasury.amount',
                        'treasuryDocumentDetails.number',
                        'treasuryDocumentDetails.dueDate',
                        'treasuryDocumentDetails.payTo',
                        knex.raw('treasury."destinationDetailAccountId" as "receiverId"'),
                        knex.raw(`destination.title as "receiverDisplay"`)
                    )
                        .from('treasury')
                        .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                        .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                        .where('treasury.branchId', this.branchId)
                        .where('treasuryType', 'payment')
                        .whereIn('treasury.id', chequesUsed.map(item => item.treasuryPayableChequeId))
                ):[],

            result = chequesUsed.asEnumerable()
                .join(
                    treasuryPayableCheques,
                    first => first.number,
                    second => parseInt(second.number),
                    (first, second) => ({
                        number: first.number,
                        isUsed: first.isUsed,
                        amount: second.amount,
                        date: second.dueDate,
                        payTo: second.payTo,
                        receiverId: second.receiverId,
                        receiverDisplay: second.receiverDisplay
                    }))
                .concat(category.cheques.asEnumerable().where(item => !(item.isUsed && item.treasuryPayableChequeId)))
                .orderBy(item => item.number)
                .toArray();

        return result;

    }
}

module.exports = ChequeCategoryQuery;