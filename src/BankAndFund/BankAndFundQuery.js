import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../Infrastructure/BaseQuery";

@injectable()
export class BankAndFundQuery extends BaseQuery {

    @inject("SettingsQuery")
    /** @type {SettingsQuery}*/ settingsQuery = undefined;

    @inject("Enums") enums = undefined;

    getAllByType(type, parameters){
        let knex = this.knex,
            branchId = this.branchId,
            view = this[`_${type}View`].bind(this);

        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .andWhere('detailAccountType', type)
                .as('base');
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }

    getById(id){

        const knex = this.knex,
            branchId = this.branchId;

        let result = toResult(
            knex.select().from('detailAccounts')
                .where('branchId', branchId)
                .andWhere('id', id)
                .first()
        );

        if(!result)
            throw new NotFoundException();

        if(!['bank', 'fund'].includes(result.detailAccountType))
            throw new NotFoundException();

        return this[`_${result.detailAccountType}View`].call(this, result);
    }

    getAll(parameters) {
        let knex = this.knex,
            enums = this.enums,
            branchId = this.branchId,
            userId = this.state.user.id,
            fiscalPeriodId = this.state.fiscalPeriodId,
            canView = this.canView.call(this),
            subsidiaryLedgerAccounts = this.settingsQuery.get().subsidiaryLedgerAccounts,
            subledger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id),

            query = knex.select(
                knex.raw('"detailAccounts"."id" as "detailAccountId"'),
                'detailAccounts.detailAccountType',
                knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                knex.raw('"sum"(coalesce("journalQuery"."debtor" - "journalQuery"."creditor",0)) as "remainder"')
            )
                .from('detailAccounts')
                .leftJoin(knex.raw(`
                    (SELECT "journalLines"."detailAccountId", "journalLines".creditor, "journalLines".debtor 
                        from journals
                        INNER JOIN "journalLines" ON journals."id" = "journalLines"."journalId"
                        WHERE journals."periodId" = '${fiscalPeriodId}'
                            and journals."branchId" = '${branchId}'
                            AND ('${canView}' or journals."createdById" = '${userId}')
	                        and "journalLines"."subsidiaryLedgerAccountId" in ('${subledger.bank || 0}', '${subledger.fund || 0}'))
                         as "journalQuery"`)
                    , 'detailAccounts.id', 'journalQuery.detailAccountId')
                .where('detailAccounts.branchId', branchId)
                .whereIn('detailAccounts.detailAccountType', ['bank', 'fund'])
                .groupBy(
                    'detailAccounts.id',
                    'detailAccounts.detailAccountType',
                    'detailAccounts.title'
                );


        return toResult(
            Utility.kendoQueryResolve(query, parameters, item => ({
                id: item.detailAccountId,
                type: item.detailAccountType,
                typeDisplay: item.detailAccountType
                    ? enums.DetailAccountType().getDisplay(item.detailAccountType)
                    : '',
                title: item.detailAccountDisplay,
                remainder: canView ? item.remainder : '?'
            }))
        );
    }

    getSummary() {
        let knex = this.knex,
            enums = this.enums,
            branchId = this.branchId,
            userId = this.state.user.id,
            fiscalPeriodId= this.state.fiscalPeriodId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            subsidiaryLedgerAccounts = this.settingsQuery.get().subsidiaryLedgerAccounts,
            subledger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id);

        let subLedgerFilter = [];

        if(subledger.bank)
            subLedgerFilter.push(subledger.bank);

        if(subledger.fund)
            subLedgerFilter.push(subledger.fund);

        if(subLedgerFilter.length === 0)
            return [];

        return toResult(
            knex.select(
                'journalLines.detailAccountId',
                'detailAccounts.detailAccountType',
                knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                knex.raw('"sum"(CAST("journalLines"."debtor" - "journalLines"."creditor" as FLOAT)) as "remainder"')
            )
                .from('journalLines')
                .leftJoin('journals', 'journalLines.journalId', 'journals.id')
                .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
                .modify(modify, branchId, userId, canView, 'journals')
                .andWhere('journals.periodId', fiscalPeriodId)
                .whereIn('journalLines.subsidiaryLedgerAccountId', [subledger.bank, subledger.fund])
                .whereIn('detailAccounts.detailAccountType', ['bank', 'fund'])
                .groupBy(
                    'journalLines.detailAccountId',
                    'detailAccounts.detailAccountType',
                    'detailAccounts.title'
                )
                .map(item => ({
                    accountId: item.detailAccountId,
                    accountType: item.detailAccountType,
                    accountTypeDisplay: item.detailAccountType
                        ? enums.DetailAccountType().getDisplay(item.detailAccountType)
                        : '',
                    accountName: item.detailAccountDisplay,
                    remainder: canView ? item.remainder : '?'
                }))
        );
    }

    _bankView(entity) {
        return {
            id: entity.id,
            code: entity.code,
            display: entity.display,
            title: entity.title,
            description: entity.description,
            bank: entity.bank,
            bankAccountNumber: entity.bankAccountNumber,
            bankAccountCartNumber: entity.bankAccountCartNumber,
            bankBranch: entity.bankBranch
        };
    }

    _fundView(entity){
        return {
            id: entity.id,
            code: entity.code,
            display: entity.display,
            title: entity.title,
            description: entity.description
        };
    }
}

