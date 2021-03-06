import { injectable, inject } from "inversify";
import toResult from "asyncawait/await";
import moment from "moment-jalaali";

import defaultAccountCategories from "./json/accountCategories.json";
import defaultGeneralLedgerAccounts from "./json/generalLedgerAccounts.json";
import defaultSubsidiaryLedgerAccounts from "./json/subsidiatyLedgerAccounts.json";

@injectable()
export class SetupBranch {

    @inject("DbContext")
    /** @type {DbContext}*/_dbContext = undefined;

    @inject("Enums") enums = undefined;

    register(branchId) {

        const knex = this._dbContext.instance;

        const branch = toResult(knex.from('branches').where({ id: branchId }).first());

        if (!branch)
            throw new NotFoundException();

        toResult(knex('settings').insert({
            id: Utility.Guid.create(),
            subsidiaryLedgerAccounts: JSON.stringify([]),
            branchId
        }));

        toResult(knex('treasurySettings').insert({
            id: Utility.Guid.create(),
            subsidiaryLedgerAccounts: JSON.stringify([]),
            branchId
        }));

        toResult(knex('detailAccounts').insert({
            id: Utility.Guid.create(),
            title: 'صندوق اصلی',
            detailAccountType: 'fund',
            branchId
        }));

        toResult(knex('stocks').insert({
            id: Utility.Guid.create(),
            title: 'انبار اصلی',
            branchId
        }));

        toResult(knex('invoice_types').insert({
            id: Utility.Guid.create(),
            title: 'فروش نقدی',
            branchId
        }));

        toResult(
            knex('inventoryIOTypes').insert(this.enums.InventoryIOType().data.map(e => ( {
                id: Utility.Guid.create(),
                title: e.display,
                type: e.key.startsWith('input') ? 'input' : 'output',
                key: e.key,
                branchId
            } )))
        );

        const date = moment(),
            year = date.jYear(),
            isLeap = moment.jIsLeapYear(year),
            maxDate = `${year}/12/${isLeap ? '30' : '29'}`;

        toResult(knex('fiscalPeriods').insert({
            id: Utility.Guid.create(),
            isClosed: false,
            title: `سال مالی منتهی به ${maxDate}`,
            minDate: `${year}/01/01`,
            maxDate: `${year}/12/${isLeap ? '30' : '29'}`,
            branchId
        }));

        this.chartOfAccounts(branchId);
    }

    chartOfAccounts(branchId) {

        const knex = this._dbContext.instance;

        const branch = toResult(knex.from('branches').where({ id: branchId }).first());

        if (!branch)
            throw new NotFoundException();

        toResult(knex('subsidiaryLedgerAccounts').where('branchId', branchId).del());
        toResult(knex('generalLedgerAccounts').where('branchId', branchId).del());
        toResult(knex('accountCategories').where('branchId', branchId).del());

        const groups = defaultAccountCategories.groups;

        groups.forEach(item => item.branchId = branchId);

        defaultGeneralLedgerAccounts.forEach(item => {
            item.branchId = branchId;
            item.id = Utility.Guid.create();
        });

        let subsidiaryLedgerAccounts = defaultSubsidiaryLedgerAccounts.asEnumerable().join(
            defaultGeneralLedgerAccounts,
            sla => sla.parentCode,
            gla => gla.code,
            (sla, gla) => ( {
                id: Utility.Guid.create(),
                branchId,
                generalLedgerAccountId: gla.id,
                code: sla.code,
                title: sla.title,
                key: sla.key,
                balanceType: sla.balanceType,
                hasDetailAccount: sla.hasDetailAccount
            } ))
            .toArray();


        groups.forEach(item => delete item.category);
        subsidiaryLedgerAccounts.forEach(item => delete item.key);

        toResult(knex('accountCategories').insert(groups));
        toResult(knex('generalLedgerAccounts').insert(defaultGeneralLedgerAccounts));

        Utility.delay(1000);

        toResult(knex('subsidiaryLedgerAccounts').insert(subsidiaryLedgerAccounts));
    }
}