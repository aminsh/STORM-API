import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportTreasuryChequeQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;
    
    @inject("Enums") enums = undefined;

    getChequesDueDate(treasuryType, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            minDate = this.filter.minDate || this.options.fromMainDate,
            maxDate = this.filter.maxDate || this.options.toDate,
            enums = this.enums,

            query = knex.from(function () {
                this.select(
                    'treasury.transferDate',
                    'treasury.description',
                    'treasury.amount',
                    'treasury.sourceDetailAccountId',
                    'treasury.destinationDetailAccountId',
                    knex.raw(`"sourceDetailAccounts".title as "payerTitle"`),
                    knex.raw(`"destinationDetailAccounts".title as "receiverTitle"`),
                    knex.raw(`"sourceDetailAccounts".title || ' ${'کد'} ' || COALESCE("sourceDetailAccounts".code,'--') as "payerDisplay"`),
                    knex.raw(`"destinationDetailAccounts".title || ' ${'کد'} ' || COALESCE("destinationDetailAccounts".code,'--') as "receiverDisplay"`),
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasuryDocumentDetails.bank',
                    'treasuryDocumentDetails.status',
                    knex.raw(`'${minDate}' as "fromDate"`),
                    knex.raw(`'${maxDate}' as "toDate"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id, "detailAccounts".code 
                                     from "detailAccounts")as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id, "detailAccounts".code
                                     from "detailAccounts")as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasury.documentType', 'cheque')
                    .where('treasury.treasuryType', treasuryType)
                    .where('treasury.isCompleted', 'false')
                    .whereBetween('treasuryDocumentDetails.dueDate', [minDate, maxDate])
                    .as('base')
            });

        let view = (item) => ({
            transferDate: item.transferDate,
            description: item.description,
            amount: item.amount,
            payerId: item.sourceDetailAccountId,
            payerTitle: item.payerTitle,
            payerDisplay: item.payerDisplay,
            receiverId: item.destinationDetailAccountId,
            receiverTitle: item.receiverTitle,
            receiverDisplay: item.receiverDisplay,
            number: item.number,
            dueDate: item.dueDate,
            bank: item.bank,
            status: item.status,
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
            fromDate: item.fromDate,
            toDate: item.toDate
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));

    }

    getPassedCheque(treasuryType, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            minDate = this.filter.minDate || this.options.fromMainDate,
            maxDate = this.filter.maxDate || this.options.toDate,
            enums = this.enums,

            query = knex.from(function () {
                this.select(
                    'treasury.transferDate',
                    'treasury.description',
                    'treasury.amount',
                    'treasury.sourceDetailAccountId',
                    'treasury.destinationDetailAccountId',
                    knex.raw(`"sourceDetailAccounts".title as "payerTitle"`),
                    knex.raw(`"destinationDetailAccounts".title as "receiverTitle"`),
                    knex.raw(`"sourceDetailAccounts".title || ' ${'کد'} ' || COALESCE("sourceDetailAccounts".code,'--') as "payerDisplay"`),
                    knex.raw(`"destinationDetailAccounts".title || ' ${'کد'} ' || COALESCE("destinationDetailAccounts".code,'--') as "receiverDisplay"`),
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasuryDocumentDetails.bank',
                    'treasuryDocumentDetails.status',
                    knex.raw(`'${minDate}' as "fromDate"`),
                    knex.raw(`'${maxDate}' as "toDate"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id, "detailAccounts".code
                                     from "detailAccounts")as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id, "detailAccounts".code
                                     from "detailAccounts")as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasury.documentType', 'cheque')
                    .where('treasury.treasuryType', treasuryType)
                    .where('treasuryDocumentDetails.status', 'passed')
                    .whereBetween('treasuryDocumentDetails.dueDate', [minDate, maxDate])
                    .as('base')
            });

        let view = (item) => ({
            transferDate: item.transferDate,
            description: item.description,
            amount: item.amount,
            payerId: item.sourceDetailAccountId,
            payerTitle: item.payerTitle,
            payerDisplay: item.payerDisplay,
            receiverId: item.destinationDetailAccountId,
            receiverTitle: item.receiverTitle,
            receiverDisplay: item.receiverDisplay,
            number: item.number,
            dueDate: item.dueDate,
            bank: item.bank,
            status: item.status,
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
            fromDate: item.fromDate,
            toDate: item.toDate
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }

    getChequesWithStatus(treasuryType, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            minDate = this.filter.minDate || this.options.fromMainDate,
            maxDate = this.filter.maxDate || this.options.toDate,
            enums = this.enums,

            query = knex.from(function () {
                this.select(
                    'treasury.transferDate',
                    'treasury.description',
                    'treasury.amount',
                    'treasury.sourceDetailAccountId',
                    'treasury.destinationDetailAccountId',
                    knex.raw(`"sourceDetailAccounts".title as "payerTitle"`),
                    knex.raw(`"destinationDetailAccounts".title as "receiverTitle"`),
                    knex.raw(`"sourceDetailAccounts".title || ' ${'کد'} ' || COALESCE("sourceDetailAccounts".code,'--') as "payerDisplay"`),
                    knex.raw(`"destinationDetailAccounts".title || ' ${'کد'} ' || COALESCE("destinationDetailAccounts".code,'--') as "receiverDisplay"`),
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasuryDocumentDetails.bank',
                    'treasuryDocumentDetails.status',
                    knex.raw(`'${minDate}' as "fromDate"`),
                    knex.raw(`'${maxDate}' as "toDate"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id, "detailAccounts".code
                                     from "detailAccounts")as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id, "detailAccounts".code
                                     from "detailAccounts")as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasury.documentType', 'cheque')
                    .where('treasury.treasuryType', treasuryType)
                    .whereBetween('treasuryDocumentDetails.dueDate', [minDate, maxDate])
                    .as('base')
            });

        let view = (item) => ({
            transferDate: item.transferDate,
            description: item.description,
            amount: item.amount,
            payerId: item.sourceDetailAccountId,
            payerTitle: item.payerTitle,
            payerDisplay: item.payerDisplay,
            receiverId: item.destinationDetailAccountId,
            receiverTitle: item.receiverTitle,
            receiverDisplay: item.receiverDisplay,
            number: item.number,
            dueDate: item.dueDate,
            bank: item.bank,
            status: item.status,
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
            fromDate: item.fromDate,
            toDate: item.toDate
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }

}