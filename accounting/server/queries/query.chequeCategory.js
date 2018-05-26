"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.chequeCategory');

class ChequeCategoryQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            query = knex.select().from(function () {
                let selectExp = knex.raw('"chequeCategories".*, "detailAccounts".code || \' \' || "detailAccounts".title as "bankDisplay"');

                this.select(selectExp)
                    .from('chequeCategories')
                    .leftJoin('detailAccounts', 'chequeCategories.bankId', 'detailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'chequeCategories')
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            category = this.await(
                this.knex.table('chequeCategories')
                    .modify(modify, branchId, userId, canView)
                    .where('id', id)
                    .first());
        return category ? view(category) : {};
    }

    getCheque(bankId) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            firstOpenCategory = await(
                this.knex.table('chequeCategories')
                    .modify(modify, branchId, userId, canView)
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
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            category = this.await(knex.select('cheques')
                .from('chequeCategories')
                .modify(modify, branchId, userId, canView)
                .where({id}).first()),
            chequesUsed = category
                ? category.cheques.asEnumerable()
                    .where(item => item.isUsed && item.treasuryPayableChequeId)
                    .toArray()
                : [],

            treasuryPayableCheques = chequesUsed && chequesUsed.length > 0
                ? this.await(
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
                        .modify(modify, branchId, userId, canView, 'treasury')
                        .where('treasuryType', 'payment')
                        .whereIn('treasury.id', chequesUsed.map(item => item.treasuryPayableChequeId))
                ) : [],

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
                .concat(category && category.cheques.asEnumerable()
                    .where(item => !(item.isUsed && item.treasuryPayableChequeId)))
                .orderBy(item => item.number)
                .toArray();

        return result;

    }
}

module.exports = ChequeCategoryQuery;