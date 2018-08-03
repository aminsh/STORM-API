import {DetailAccountQuery} from "./DetailAccount/DetailAccountQuery";
import {DetailAccountRepository} from "./DetailAccount/DetailAccountRepository";
import {DetailAccountService} from "./DetailAccount/DetailAccountService";
import {ChartOfAccountQuery} from "./ChartOfAccounts/ChartOfAccountQuery";
import {AccountCategoryService} from "./ChartOfAccounts/AccountCategoryService";
import {AccountCategoryRepository} from "./ChartOfAccounts/AccountCategoryRepository";
import {GeneralLedgerAccountRepository} from "./ChartOfAccounts/GeneralLedgerAccountRepository";
import {GeneralLedgerAccountService} from "./ChartOfAccounts/GeneralLedgerAccountService";
import {SubsidiaryLedgerAccountRepository} from "./ChartOfAccounts/SubsidiaryLedgerAccountRepository";
import {SubsidiaryLedgerAccountService} from "./ChartOfAccounts/SubsidiaryLedgerAccountService";

import "./DetailAccount/DetailAccountController";
import "./ChartOfAccounts/ChartOfAccountController";

export function register(container) {

    container.bind("DetailAccountQuery").to(DetailAccountQuery);
    container.bind("DetailAccountRepository").to(DetailAccountRepository);
    container.bind("DetailAccountService").to(DetailAccountService);

    container.bind("GeneralLedgerAccountRepository").to(GeneralLedgerAccountRepository);
    container.bind("GeneralLedgerAccountService").to(GeneralLedgerAccountService);
    container.bind("SubsidiaryLedgerAccountRepository").to(SubsidiaryLedgerAccountRepository);
    container.bind("SubsidiaryLedgerAccountService").to(SubsidiaryLedgerAccountService);

    container.bind("ChartOfAccountQuery").to(ChartOfAccountQuery);
    container.bind("AccountCategoryRepository").to(AccountCategoryRepository);
    container.bind("AccountCategoryService").to(AccountCategoryService);

}