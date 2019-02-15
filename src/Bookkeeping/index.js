import {DetailAccountQuery} from "./DetailAccount/DetailAccountQuery";
import {DetailAccountRepository} from "./DetailAccount/DetailAccountRepository";
import {DetailAccountService} from "./DetailAccount/DetailAccountService";

import {DetailAccountCategoryRepository} from "./DetailAccount/DetailAccountCategoryRepsitory";
import {DetailAccountCategoryQuery} from "./DetailAccount/DetailAccountCategoryQuery";
import {DetailAccountCategoryService} from "./DetailAccount/DetailAccountCategoryService";

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
import {JournalGenerationTemplateEngine} from "./Journal/JournalGenerationTemplateEngine";
import {JournalGenerationTemplateQuery} from "./Journal/JournalGenerationTemplateQuery";
import {AccountReviewQuery} from "./AccountReview/AccountReviewQuery";

import {JournalTemplateQuery} from "./Journal/JournalTemplateQuery";
import {JournalTemplateRepository} from "./Journal/JournalTemplateRepository";
import {JournalTemplateService} from "./Journal/JournalTemplateService";

import {TreasuryJournalGenerationService} from "./Journal/TreasuryJournalGenerationService";
import {TreasuryEventListener} from "./Journal/TreasuryEventListener";
import {JournalGenerationPurposeQuery} from "./Journal/JournalGenerationPurposeQuery";

import {SaleMapper} from "./JournalGenerationTemplate/SaleMapper";
import {PurchaseMapper} from "./JournalGenerationTemplate/PurchaseMapper";

import {ProductEventListener} from "./ProductEventListener";
import {StockEventListener} from "./StockEventListener";

import "./DetailAccount/DetailAccountController";
import "./DetailAccount/DetailAccountCategoryController";
import "./ChartOfAccounts/ChartOfAccountController";
import "./Dimension/DimensionCategoryController";
import "./Dimension/DimensionController";
import "./Journal/JournalController";
import "./Journal/JournalGenerationTemplateController";
import "./AccountReview/AcccountReviewController";
import "./Journal/JournalTemplateController";

export function register(container) {

    container.bind("DetailAccountQuery").to(DetailAccountQuery);
    container.bind("DetailAccountRepository").to(DetailAccountRepository);
    container.bind("DetailAccountService").to(DetailAccountService);

    container.bind("DetailAccountCategoryRepository").to(DetailAccountCategoryRepository);
    container.bind("DetailAccountCategoryQuery").to(DetailAccountCategoryQuery);
    container.bind("DetailAccountCategoryService").to(DetailAccountCategoryService);

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
    container.bind("JournalGenerationPurposeQuery").to(JournalGenerationPurposeQuery);

    container.bind("JournalTemplateQuery").to(JournalTemplateQuery);
    container.bind("JournalTemplateRepository").to(JournalTemplateRepository);
    container.bind("JournalTemplateService").to(JournalTemplateService);

    container.bind("JournalGenerationTemplateRepository").to(JournalGenerationTemplateRepository);
    container.bind("JournalGenerationTemplateService").to(JournalGenerationTemplateService);
    container.bind("JournalGenerationTemplateEngine").to(JournalGenerationTemplateEngine);
    container.bind("JournalGenerationTemplateQuery").to(JournalGenerationTemplateQuery);

    container.bind("AccountReviewQuery").to(AccountReviewQuery);

    container.bind("TreasuryJournalGenerationService").to(TreasuryJournalGenerationService);
    container.bind("TreasuryEventListener").to(TreasuryEventListener);

    container.bind("SaleMapper").to(SaleMapper);
    container.bind("PurchaseMapper").to(PurchaseMapper);

    container.bind("ProductEventListener").to(ProductEventListener);
    container.bind("StockEventListener").to(StockEventListener);
}