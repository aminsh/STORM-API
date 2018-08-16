import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class PayableChequeCategoryQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                let selectExp = knex.raw('"chequeCategories".*, "detailAccounts".code || \' \' || "detailAccounts".title as "bankDisplay"');

                this.select(selectExp)
                    .from('chequeCategories')
                    .leftJoin('detailAccounts', 'chequeCategories.bankId', 'detailAccounts.id')
                    .where('chequeCategories.branchId', branchId)
                    .as('base');
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getById(id) {
        let branchId = this.branchId,
            category = toResult(
                this.knex.table('chequeCategories')
                    .where('branchId', branchId)
                    .where('id', id)
                    .first()
            );
        return category ? this._view.call(this, category) : {};
    }

    getCheque(bankId) {
        let branchId = this.branchId,
            firstOpenCategory = toResult(
                this.knex.table('chequeCategories')
                    .where('branchId', branchId)
                    .where('isClosed', false)
                    .where('bankId', bankId)
                    .orderBy('createdAt')
                    .first()
            );

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
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            category = toResult(knex.select('cheques')
                .from('chequeCategories')
                .modify(modify, branchId, userId, canView)
                .where({id}).first()
            ),
            chequesUsed = category
                ? category.cheques.asEnumerable()
                    .where(item => item.isUsed && item.treasuryPayableChequeId)
                    .toArray()
                : [],

            treasuryPayableCheques = chequesUsed && chequesUsed.length > 0
                ? toResult(
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

    _view(entity) {

        const enums = this.enums;

        return {
            id: entity.id,
            receiveDate: entity.receiveDate,
            bankId: entity.bankId,
            bankDisplay: entity.bankDisplay,
            bankName: entity.bankName,
            totalPages: entity.totalPages,
            firstPageNumber: entity.firstPageNumber,
            lastPageNumber: entity.lastPageNumber,
            description: entity.description,
            status: entity.isClosed ? 'Closed' : 'Open',
            statusDisplay: enums.ChequeCategoryStatus().getDisplay(entity.isClosed ? 'Closed' : 'Open')
        };
    }
}