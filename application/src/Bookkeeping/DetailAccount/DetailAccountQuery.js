import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../../core/BaseQuery";

@injectable()
export class DetailAccountQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    tableName = "detailAccounts";

    _view(entity) {

        const enums = this.enums;

        return {
            id: entity.id,
            code: entity.code,
            display: entity.display,
            detailAccountType: entity.detailAccountType,
            detailAccountTypeDisplay: entity.detailAccountType ? enums.DetailAccountType().getDisplay(entity.detailAccountType) : '',
            title: entity.title,
            description: entity.description,
            isActive: entity.isActive,
            address: entity.address,
            postalCode: entity.postalCode,
            province: entity.province,
            city: entity.city,
            phone: entity.phone,
            mobile: entity.mobile,
            fax: entity.fax,
            nationalCode: entity.nationalCode,
            economicCode: entity.economicCode,
            bank: entity.bank,
            bankAccountNumber: entity.bankAccountNumber,
            bankBranch: entity.bankBranch,
            email: entity.email,
            personType: entity.personType,
            personTypeDisplay: entity.personType ? enums.PersonType().getDisplay(entity.personType) : ''
        };
    }

    getAll(parameters, where, view = this._view.bind(this)) {
        let knex = this.knex,
            branchId = this.branchId,
            tableName = this.tableName,

            query = knex.from(function () {
                this.select('*', knex.raw(`coalesce("code", '') || ' ' || title as display`))
                    .from(tableName)
                    .where(Object.assign({branchId}, where))
                    .as('base');
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }

    getAllBySubsidiryLedgerAccount(subsidiaryLedgerAccountId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            categories = this.await(knex.select('id')
                .from('detailAccountCategories')
                .where('subsidiaryLedgerAccountIds', 'like', `%${subsidiaryLedgerAccountId}%`));

        if (categories.length === 0)
            return this.getAll(parameters);

        let jointCategories = `%(${categories.asEnumerable().select(e => e.id).toArray().join('|')})%`;


        let query = knex.select().from(function () {
            this.select(knex.raw(`*,coalesce("code", '') || ' ' || title as display`))
                .from('detailAccounts').as('baseDetailAccounts')
                .where('branchId', branchId)
                .whereRaw(`"detailAccountCategoryIds" similar to '${jointCategories}'`);
        });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }

    getById(id, view = this._view.bind(this)) {

        const knex = this.knex,
            branchId = this.branchId,

            detailAccount = toResult(
                knex.select().from(this.tableName)
                    .where({branchId, id})
                    .first()
            );

        if (!detailAccount)
            return null;

        let result = view(detailAccount),

            selectedCategories = detailAccount.detailAccountCategoryIds
                ? detailAccount.detailAccountCategoryIds.split('|')
                : [],
            allCategories = toResult(
                knex.select('id', 'title')
                    .from('detailAccountCategories')
                    .where('branchId', branchId)
            );

        result.detailAccountCategories = allCategories.asEnumerable().groupJoin(
            selectedCategories,
            all => all.id,
            selected => selected,
            (all, items) => ({id: all.id, title: all.title, isSelected: items.any()}))
            .toArray();

        return result;
    }
    getBankAndFundTurnover(id, type, fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            subsidiaryLedgerAccounts = toResult(knex.from('settings').where('branchId', this.branchId).first())
                .subsidiaryLedgerAccounts,
            subledger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id),

            withQuery = knex.with('journals-row', (qb) => {
                qb.select('detailAccounts.title',
                    knex.raw(`"detailAccounts".title || ' کد ' || COALESCE("detailAccounts".code,'--') as display`),
                    'journalLines.article',
                    knex.raw(`"journalLines".debtor as debtor`),
                    knex.raw(`"journalLines".creditor as creditor`),
                    'journalLines.detailAccountId',
                    knex.raw('journals."temporaryDate" as date'),
                    knex.raw('journals."temporaryNumber" as number'),
                    knex.raw(`ROW_NUMBER () OVER (ORDER BY "temporaryNumber") as "seq_row"`))
                    .from('journals')
                    .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                    .leftJoin('detailAccounts', 'detailAccounts.id', 'journalLines.detailAccountId')
                    .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
                    .where('detailAccounts.id', id)
                    .modify(modify, branchId, userId, canView, 'journals')
                    .where('journals.periodId', fiscalPeriodId)
                    .where('detailAccounts.detailAccountType', type)
                    .whereIn('subsidiaryLedgerAccounts.id', [subledger.bank, subledger.fund])
            }),

            query = withQuery.select().from(function () {
                this.select('*',
                    knex.raw(`(select sum(debtor - creditor) 
                               from "journals-row" 
                               where "seq_row" <= base."seq_row" and "detailAccountId" = base."detailAccountId") as remainder`))
                    .from('journals-row as base')
                    .groupBy(
                        'title',
                        'display',
                        'article',
                        'debtor',
                        'creditor',
                        'detailAccountId',
                        'date',
                        'number',
                        'seq_row'
                    )
                    .orderBy('base.seq_row', 'desc')
                    .as('baseQuery')
            }),


            view = entity => ({
                title: entity.title,
                article: entity.article,
                debtor: entity.debtor,
                creditor: entity.creditor,
                date: entity.date,
                display: entity.display,
                number: entity.number,
                remainder: entity.remainder,
                row_seq: entity.row_seq
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }
}