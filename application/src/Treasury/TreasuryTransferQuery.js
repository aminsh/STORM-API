import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable} from "inversify";
import * as viewAssembler from "./TreasuryViewAssembler";

@injectable()
export class TreasuryTransferQuery extends BaseQuery {

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
                    'treasury.amount',
                    'treasury.transferDate',
                    'treasury.sourceDetailAccountId',
                    'treasury.createdAt',
                    knex.raw(`source.title as "sourceTitle"`),
                    'treasury.destinationDetailAccountId',
                    knex.raw(`destination.title as "destinationTitle"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasuryType', 'transfer')
                    .as('base')
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, viewAssembler.transferView.bind(this)));

    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            treasury = toResult(knex.select(
                'treasury.id',
                'treasury.imageUrl',
                'treasury.transferDate',
                'treasury.sourceDetailAccountId',
                'treasury.destinationDetailAccountId',
                'treasury.amount',
                'treasury.journalId',
                'treasury.description',
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
                    .where('treasury.id', id)
                    .first()
            );

        if (treasury) {
            let journal = treasury.journalId ? toResult(knex.select(
                'journals.temporaryDate as date',
                'journals.temporaryNumber as number',
                'journals.id',
                'journals.description',
                'journals.createdAt'
                )
                    .from('journals')
                    .where('id', treasury.journalId)
                    .where('branchId', branchId)
                    .first()
            ) : null;

            treasury.journal = journal;
        }

        return treasury ? viewAssembler.transferView.call(this, treasury) : [];
    }

}
