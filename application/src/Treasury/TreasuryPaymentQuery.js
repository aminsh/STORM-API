import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import * as viewAssembler from "./TreasuryViewAssembler";

@injectable()
export class TreasuryPaymentQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            query = knex.from(function () {
                this.select(
                    'treasury.id',
                    'treasury.imageUrl',
                    'treasury.documentType',
                    'treasury.amount',
                    'treasury.transferDate',
                    'treasury.sourceDetailAccountId',
                    'treasury.createdAt',
                    knex.raw(`treasury."sourceDetailAccountId" as "payerId"`),
                    knex.raw(`treasury."destinationDetailAccountId" as "receiverId"`),
                    knex.raw(`source.title as "sourceTitle"`),
                    'treasury.destinationDetailAccountId',
                    knex.raw(`destination.title as "destinationTitle"`),
                    'treasuryDocumentDetails.status',
                    'treasuryDocumentDetails.number'
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasuryType', 'payment')
                    .as('base')
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, viewAssembler.view.bind(this)))

    }

    getById(id, documentType) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            treasury = toResult(knex.select(
                'treasury.*',
                knex.raw(`"sourceDetailAccounts".title as "sourceTitle"`),
                knex.raw(`"destinationDetailAccounts".title as "destinationTitle"`)
                )
                    .from('treasury')
                    .leftJoin(knex.raw(`(select da.title, da.id
                                     from "detailAccounts" as da )as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select da.title, da.id
                                     from "detailAccounts" as da )as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('documentType', documentType)
                    .where('treasury.id', id)
                    .first()
            );

        if (treasury) {
            let documentDetail = toResult(knex.select('treasuryDocumentDetails.*')
                    .from('treasuryDocumentDetails')
                    .where('id', treasury.documentDetailId)
                    .where('branchId', branchId)
                    .first()
                ),

                journalIds = treasury.documentType === 'cheque' && documentDetail.chequeStatusHistory
                    ? documentDetail.chequeStatusHistory.asEnumerable()
                        .where(e => e.journalId)
                        .select(item => item.journalId)
                        .toArray()
                    : treasury.journalId ? [treasury.journalId] : null;

            let journals = (journalIds || []).length > 0
                ? toResult(knex.select(
                    'journals.temporaryDate as date',
                    'journals.temporaryNumber as number',
                    'journals.id',
                    'journals.description'
                    )
                        .from('journals')
                        .whereIn('id', journalIds)
                        .where('branchId', branchId)
                )
                : null;


            treasury.documentDetail = documentDetail;
            treasury.journals = journals;

            if (treasury.documentType.toLowerCase().includes("cheque"))
                return viewAssembler.chequeView.call(this, treasury);

            return viewAssembler[`${treasury.documentType}View`].call(this, treasury);

           /* if (treasury.documentType === 'cash')
                return cashView(treasury);

            if (treasury.documentType === 'receipt')
                return receiptView(treasury);

            if (treasury.documentType === 'demandNote')
                return demandNote(treasury);*/
        }

        return treasury ? viewAssembler.view.call(this, treasury) : [];
    }
}

