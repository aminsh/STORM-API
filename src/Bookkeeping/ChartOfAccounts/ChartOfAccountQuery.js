import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";

@injectable()
export class ChartOfAccountQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    chartOfAccount() {
        const branchId = this.branchId,
            knex = this.knex,
            groups = toResult(this.knex.select('*').from('accountCategories').where({branchId})),
            generalLedgerAccounts = toResult(this.knex.select('*', knex.raw("*,code || ' ' || title as display")).from('generalLedgerAccounts').where({branchId})),
            subsidiaryLedgerAccounts = toResult(this.knex.select('*', knex.raw("*,code || ' ' || title as display")).from('subsidiaryLedgerAccounts').where({branchId}));

        return groups.asEnumerable()
            .select(g => ({
                key: g.key,
                display: g.display,
                generalLedgerAccounts: generalLedgerAccounts.asEnumerable()
                    .where(gla => gla.groupingType === g.key)
                    .select(gla => ({
                        id: gla.id,
                        display: gla.display,
                        subsidiaryLedgerAccounts: subsidiaryLedgerAccounts.asEnumerable()
                            .where(sla => sla.generalLedgerAccountId === gla.id)
                            .select(sla => ({
                                id: sla.id,
                                display: sla.display
                            }))
                            .toArray()
                    }))
                    .toArray()
            }))
            .toArray();
    }

    accountCategory() {
        return toResult(this.knex.select('key', 'display')
            .from('accountCategories')
            .where('branchId', this.branchId));
    }

    generalLedgerAccounts(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                this.select(knex.raw("*,code || ' ' || title as display"))
                    .from('generalLedgerAccounts')
                    .where('branchId', branchId)
                    .as('baseGeneralLedgerAccounts');
            }).as('baseGeneralLedgerAccounts');

        return toResult(Utility.kendoQueryResolve(query, parameters, this._glaView.bind(this)));
    }

    generalLedgerAccountGetById(id) {
        let generalLedgerAccount = toResult(
            this.knex.table('generalLedgerAccounts')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());

        return this._glaView(generalLedgerAccount);
    }

    subsidiaryLedgerAccountById(id) {
        let subsidiaryLedgerAccount = toResult(
            this.knex.table('subsidiaryLedgerAccounts')
                .where('branchId', this.branchId)
                .where('id', id).first());

        return this._slaView(subsidiaryLedgerAccount);
    }


    _glaView(entity) {

        return {
            id: entity.id,
            code: entity.code,
            title: entity.title,
            display: entity.display,
            postingType: entity.postingType,
            groupingType: entity.groupingType,
            postingTypeDisplay: entity.postingType ? this.enums.AccountPostingType().getDisplay(entity.postingType) : '',
            description: entity.description,
            isLocked: entity.isLocked
        }
    }

    _slaView(entity){

        return {
            id: entity.id,
            generalLedgerAccountId: entity.generalLedgerAccountId,
            generalLedgerAccountDisplay: entity.generalLedgerAccountDisplay,
            code: entity.code,
            title: entity.title,
            display: entity.display,
            account: entity.account,
            isBankAccount: entity.isBankAccount,
            balanceType: entity.balanceType,
            balanceTypeDisplay: entity.balanceType ? this.enums.AccountBalanceType().getDisplay(entity.balanceType) : '',
            hasDetailAccount: entity.hasDetailAccount,
            hasDimension1: entity.hasDimension1,
            hasDimension2: entity.hasDimension2,
            hasDimension3: entity.hasDimension3,
            description: entity.description,
            isLocked: entity.isLocked
        };
    }
}