import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import * as viewAssembler from "./TreasuryViewAssembler";

@injectable()
export class TreasuryPurposeQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getTreasuryAmountById(id) {

        let knex = this.knex,
            branchId = this.branchId;

        return toResult(knex.select(
            'treasury.id',
            'treasury.amount'
            )
                .from('treasury')
                .where('treasury.branchId', branchId)
                .where('treasury.id', id)
                .first()
        );
    }

    getByInvoiceId(id, parameters) {

        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            treasuryIds = toResult(
                knex.select(
                    'treasuryPurpose.treasuryId')
                    .from('treasuryPurpose')
                    .where('treasuryPurpose.branchId', branchId)
                    .where('treasuryPurpose.referenceId', id)
            ),


            treasuries = knex.from(function () {
                this.select(
                    'treasury.id',
                    'treasury.imageUrl',
                    'treasury.documentType',
                    'treasury.amount',
                    'treasury.transferDate',
                    'treasury.sourceDetailAccountId',
                    knex.raw(`treasury."sourceDetailAccountId" as "payerId"`),
                    knex.raw(`treasury."destinationDetailAccountId" as "receiverId"`),
                    knex.raw(`source.title as "sourceTitle"`),
                    'treasury.destinationDetailAccountId',
                    knex.raw(`destination.title as "destinationTitle"`),
                    'treasuryDocumentDetails.status',
                    'treasuryDocumentDetails.number'
                )
                    .from('treasury')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .leftJoin('treasuryDocumentDetails', 'treasuryDocumentDetails.id', 'treasury.documentDetailId')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .whereIn('treasury.id', treasuryIds.map(item => item.treasuryId))
                    .as('base')
            });

        return toResult(Utility.kendoQueryResolve(treasuries, parameters, viewAssembler.view.bind(this)));
    }

    getTreasuriesTotalAmount(invoiceId) {
        let knex = this.knex,
            branchId = this.branchId,
            treasuriesAmount = [],

            treasuryIds = toResult(knex.select(
                'treasuryPurpose.treasuryId')
                .from('treasuryPurpose')
                .where('treasuryPurpose.branchId', branchId)
                .where('treasuryPurpose.referenceId', invoiceId));

        treasuryIds.forEach(item => {
            treasuriesAmount.push(this.getTreasuryAmountById(item.treasuryId));
        });

        return treasuriesAmount.length > 0 ? treasuriesAmount.asEnumerable().sum(item => item.amount) : 0;
    }
}
