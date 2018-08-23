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
import {DimensionCategoryRepository} from "./Dimension/DimensionCategoryRepository";
import {DimensionRepository} from "./Dimension/DimensionRepository";
import {DimensionService} from "./Dimension/DimensionService";
import {DimensionCategoryQuery} from "./Dimension/DimensionCategoryQuery";
import {DimensionQuery} from "./Dimension/DimensionQuery";
import {JournalService} from "./Journal/JournalService";
import {JournalRepository} from "./Journal/JournalRepository";
import {JournalQuery} from "./Journal/JournalQuery";
import {JournalGenerationTemplateRepository} from "./Journal/JournalGenerationTemplateRepository";
import {JournalGenerationTemplateService} from "./Journal/JournalGenerationTemplateService";
import {JournalGenerationTemplateQuery} from "./Journal/JournalGenerationTemplateQuery";
import {AccountReviewQuery} from "./AccountReview/AccountReviewQuery";

import {JournalInvoiceGenerationService} from "./Journal/JournalInvoiceGenerationService";
import {SaleEventListener} from "./Journal/SaleEventListener";
import {PurchaseEventListener} from "./Journal/PurchaseEventListener";

import "./DetailAccount/DetailAccountController";
import "./ChartOfAccounts/ChartOfAccountController";
import "./Dimension/DimensionCategoryController";
import "./Dimension/DimensionController";
import "./Journal/JournalController";
import "./Journal/JournalGenerationTemplateController";
import "./AccountReview/AcccountReviewController";

export function register(container) {

    container.bind("DetailAccountQuery").to(DetailAccountQuery);
    container.bind("DetailAccountRepository").to(DetailAccountRepository);
    container.bind("DetailAccountService").to(DetailAccountService);

    container.bind("DimensionCategoryRepository").to(DimensionCategoryRepository);
    container.bind("DimensionRepository").to(DimensionRepository);
    container.bind("DimensionService").to(DimensionService);
    container.bind("DimensionCategoryQuery").to(DimensionCategoryQuery);
    container.bind("DimensionQuery").to(DimensionQuery);

    container.bind("GeneralLedgerAccountRepository").to(GeneralLedgerAccountRepository);
    container.bind("GeneralLedgerAccountService").to(GeneralLedgerAccountService);
    container.bind("SubsidiaryLedgerAccountRepository").to(SubsidiaryLedgerAccountRepository);
    container.bind("SubsidiaryLedgerAccountService").to(SubsidiaryLedgerAccountService);

    container.bind("ChartOfAccountQuery").to(ChartOfAccountQuery);
    container.bind("AccountCategoryRepository").to(AccountCategoryRepository);
    container.bind("AccountCategoryService").to(AccountCategoryService);

    container.bind("JournalService").to(JournalService);
    container.bind("JournalRepository").to(JournalRepository);
    container.bind("JournalQuery").to(JournalQuery);

    container.bind("JournalGenerationTemplateRepository").to(JournalGenerationTemplateRepository);
    container.bind("JournalGenerationTemplateService").to(JournalGenerationTemplateService);
    container.bind("JournalGenerationTemplateQuery").to(JournalGenerationTemplateQuery);

    container.bind("AccountReviewQuery").to(AccountReviewQuery);

    container.bind("JournalInvoiceGenerationService").to(JournalInvoiceGenerationService);
    container.bind("SaleEventListener").to(SaleEventListener);
    container.bind("PurchaseEventListener").to(PurchaseEventListener);
}