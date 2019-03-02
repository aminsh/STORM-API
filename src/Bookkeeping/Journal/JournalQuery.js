import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";
import JournalQueryBase from "./JournalQueryBase";
import JounalBaseFilter from "./JournalBaseFilter";
import JournalLineBase from "./JournalLineBase";

@injectable()
export class JournalQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getMaxNumber() {

        return toResult(
            this.knex.from('journals')
                .where({branchId: this.branchId, periodId: this.state.fiscalPeriodId})
                .max('temporaryNumber')
        )[0].max;
    }

    batchFindById(journalId) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            journalLines = toResult(knex.select(
                'id',
                'row',
                'creditor',
                'debtor',
                'article',
                'subsidiaryLedgerAccountId',
                'detailAccountId',
                'dimension1Id',
                'dimension2Id',
                'dimension3Id'
            )
                .from('journalLines')
                .modify(modify, branchId, userId, canView)
                .where('journalId', journalId)),
            journal = toResult(
                knex.select()
                    .from('journals')
                    .modify(modify, branchId, userId, canView)
                    .andWhere('id', journalId)
                    .first()
            );

        if (journal)
            journal.journalLines = journalLines;

        return journal;
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            fiscalPeriodId = this.state.fiscalPeriodId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            extra = (parameters.extra) ? parameters.extra : undefined;

        let query = knex.select().from(function () {
            this.select(
                'id',
                'number',
                'date',
                'description',
                'journalStatus',
                'issuer',
                knex.raw('sum("debtor") as "sumDebtor"'),
                knex.raw('sum("creditor") as "sumCreditor"')
            )
                .from(function () {
                    JournalQueryBase.call(this, knex, {
                        numberFieldName: 'temporaryNumber',
                        dateFieldName: 'temporaryDate',
                        branchId,
                        userId,
                        canView,
                        modify
                    });

                    JounalBaseFilter(this, extra, fiscalPeriodId, knex);
                })
                .groupBy(
                    'id',
                    'number',
                    'date',
                    'description',
                    'journalStatus',
                    'issuer')
                .as('base');

        });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)));
    }

    getGroupedByMouth() {
        let knex = this.knex,
            branchId = this.branchId,
            currentFiscalPeriod = this.state.fiscalPeriodId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            selectExp = '"month",' +
                '"count"(*) as "count",' +
                '"min"("temporaryNumber") as "minNumber",' +
                '"max"("temporaryNumber") as "maxNumber",' +
                '"min"("temporaryDate") as "minDate",' +
                '"max"("temporaryDate") as "maxDate"';

        let query = knex.select(knex.raw(selectExp)).from(function () {
            this.select(knex.raw('*,cast(substring("temporaryDate" from 6 for 2) as INTEGER) as "month"'))
                .from('journals')
                .modify(modify, branchId, userId, canView)
                .andWhere('periodId', currentFiscalPeriod)
                .as('baseJournals');
        })
            .as('baseJournals')
            .groupBy('month')
            .orderBy('month');

        let result = toResult(query);

        result.forEach(item => item.monthName = this.enums.getMonth().getDisplay(item.month));

        return {data: result};
    }

    getJournalsByMonth(month, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            currentFiscalPeriod = this.state.fiscalPeriodId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            selectExp = '"id","temporaryNumber","temporaryDate","number","date","description",' +
                'CASE WHEN "journalStatus"=\'Fixed\' THEN TRUE ELSE FALSE END as "isFixed",' +
                'CASE WHEN "attachmentFileName" IS NOT NULL THEN TRUE ELSE FALSE END as "hasAttachment",' +
                '(select "sum"("debtor") from "journalLines" WHERE "journalId" = journals."id") as "sumAmount",' +
                '(select "count"(*) from "journalLines" WHERE "journalId" = journals."id") as "countOfRows"';

        let query = knex.select().from(function () {
            this.select(knex.raw(selectExp)).from('journals')
                .modify(modify, branchId, userId, canView)
                .andWhere(knex.raw('cast(substring("temporaryDate" from 6 for 2) as INTEGER)'), month)
                .andWhere('periodId', currentFiscalPeriod)
                .orderBy('temporaryNumber')
                .as('baseJournals');
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, e => e));
    }

    getAllByPeriod(parameters) {
        let branchId = this.branchId,
            currentFiscalPeriod = this.state.fiscalPeriodId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            query = this.knex.select().from(function () {
                this.select().from('journals')
                    .modify(modify, branchId, userId, canView)
                    .andWhere('periodId', currentFiscalPeriod)
                    .orderBy('temporaryNumber', 'desc')
                    .as('baseJournals');
            }).as('baseJournals');

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view.bind(this)))
    }

    getById(id) {
        let knex = this.knex,
            journalLines = toResult(knex.select(
                'id',
                'row',
                'creditor',
                'debtor',
                'article',
                'subsidiaryLedgerAccountId',
                'detailAccountId',
                'dimension1Id',
                'dimension2Id',
                'dimension3Id'
            )
                .from('journalLines')
                .where('branchId', this.branchId)
                .where('journalId', id)),
            journal = toResult(knex.select()
                .from('journals')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());

        if (!journal)
            throw new NotFoundException();

        journal.journalLines = journalLines;

        return this._view.call(this, journal);
    }

    getByNumber(number) {
        let branchId = this.branchId,
            userId = this.userId,
            currentFiscalPeriodId = this.state.fiscalPeriodId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this);

        return this.knex.select('*')
            .from('journals')
            .modify(modify, branchId, userId, canView)
            .andWhere('periodId', currentFiscalPeriodId)
            .andWhere('temporaryNumber', number)
            .first();
    }

    getTotalInfo() {
        let knex = this.knex,
            branchId = this.branchId,
            currentFiscalPeriod = this.state.fiscalPeriodId,
            base = knex.from('journals')
                .where('branchId', branchId)
                .andWhere('periodId', currentFiscalPeriod),

            lastNumber = toResult(base.max('temporaryNumber')
                .first()).max,
            totalFixed = toResult(base.where('journalStatus', 'Fixed')
                .select(knex.raw('count(*)'))
                .first()).count,
            totalInComplete = toResult(base.where('isInComplete', true)
                .select(knex.raw('count(*)')).first()).count;

        return {lastNumber, totalFixed, totalInComplete};
    }

    getPayablesNotHaveChequeLines(detailAccountId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            currentFiscalPeriodId = this.state.fiscalPeriodId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            query = knex.select()
                .from(function () {
                    this.select(
                        'journalBase.id',
                        'temporaryNumber',
                        'temporaryDate',
                        'article',
                        'debtor',
                        'creditor',
                        'subsidiaryLedgerAccounts.code',
                        'subsidiaryLedgerAccounts.title'
                    )
                        .from(function () {
                            base.call(this);
                        })
                        .leftJoin('subsidiaryLedgerAccounts', 'journalBase.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
                        .andWhere('subsidiaryLedgerAccounts.isBankAccount', true)
                        .as('secondLevel')
                });


        function base() {
            this.select(
                'journalLines.id',
                'temporaryNumber',
                'temporaryDate',
                'article',
                'debtor',
                'creditor',
                'subsidiaryLedgerAccountId')
                .from('journals')
                .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                .modify(modify, branchId, userId, canView, 'journals')
                .andWhere('periodId', currentFiscalPeriodId)
                .andWhere('detailAccountId', detailAccountId)
                .andWhere('creditor', '>', 0)
                .as('journalBase')
        }

        return toResult(
            Utility.kendoQueryResolve(query, parameters, item => ({
                id: item.id,
                number: item.temporaryNumber,
                date: item.temporaryDate,
                article: item.article,
                debtor: item.debtor,
                creditor: item.creditor,
                subsidiaryLedgerAccountDisplay: `${item.code} ${item.title}`
            }))
        );

    }

    getAllLinesById(journalId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this);

        let query = knex.select()
            .from(function () {
                JournalLineBase.call(this, knex, branchId, userId, canView, modify);
            })
            .where('journalId', journalId);

        let result = toResult(Utility.kendoQueryResolve(query, parameters, this._viewLine)),
            aggregates = toResult(knex.select(knex.raw('SUM("debtor") as "sumDebtor", SUM("creditor") as "sumCreditor"'))
                .from('journalLines')
                .modify(modify, branchId, userId, canView)
                .andWhere('journalId', journalId).first());

        result.aggregates = {
            debtor: {sum: aggregates.sumDebtor},
            creditor: {sum: aggregates.sumCreditor}
        };

        return result;
    }

    _view(entity) {

        const enums = this.enums;

        return {
            id: entity.id,
            isInComplete: entity.isInComplete,
            number: entity.number,
            date: entity.date,
            temporaryNumber: entity.temporaryNumber || null,
            temporaryDate: entity.temporaryDate || null,
            description: entity.description,
            journalStatus: entity.journalStatus,
            journalStatusDisplay: enums.JournalStatus().getDisplay(entity.journalStatus),
            journalType: entity.journalType,
            journalTypeDisplay: entity.journalType
                ? enums.JournalType().getDisplay(entity.journalType)
                : '',
            tagIds: entity.tagIds,
            attachmentFileName: entity.attachmentFileName,
            createdBy: entity.createdBy,
            issuer: entity.issuer,
            issuerDisplay: entity.issuer ? enums.JournalIssuer().getDisplay(entity.issuer) : null,
            sumDebtor: entity.sumDebtor,
            sumCreditor: entity.sumCreditor,
            journalLines: entity.journalLines
        };
    }

    _viewLine(entity) {
        return {
            id: entity.id,
            row: entity.row,
            creditor: entity.creditor,
            debtor: entity.debtor,
            article: entity.article,
            generalLedgerAccountId: entity.generalLedgerAccountId,
            generalLedgerAccountCode: entity.generalLedgerAccountCode,
            generalLedgerAccountDisplay: entity.generalLedgerAccountDisplay,
            subsidiaryLedgerAccountId: entity.subsidiaryLedgerAccountId,
            subsidiaryLedgerAccountCode: entity.subsidiaryLedgerAccountCode,
            subsidiaryLedgerAccountDisplay: entity.subsidiaryLedgerAccountDisplay,
            detailAccountId: entity.detailAccountId,
            detailAccountCode: entity.detailAccountCode,
            detailAccountDisplay: entity.detailAccountDisplay,
            dimension1Id: entity.dimension1Id,
            dimension1Display: entity.dimension1Display,
            dimension2Id: entity.dimension2Id,
            dimension2Display: entity.dimension2Display,
            dimension3Id: entity.dimension3Id,
            dimension3Display: entity.dimension3Display,
            chequeId: entity.chequeId,
            chequeNumber: entity.chequeNumber,
            chequeDate: entity.chequeDate,
            chequeDescription: entity.chequeDescription
        }
    }
}