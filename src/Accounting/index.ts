import { Module } from "../Infrastructure/ModuleFramework";
import { DetailAccountService } from "./Application/detailAccount.service";
import { DetailAccountRepository } from "./Domain/detailAccount.repository";
import { GeneralLedgerAccountRepository } from "./Domain/generalLedgerAccount.repository";
import { GeneralLedgerAccountService } from "./Application/generalLedgerAccount.service";
import { SubsidiaryLedgerAccountRepository } from "./Domain/subsidiaryLedgerAccount.repository";
import { SubsidiaryLedgerAccountService } from "./Application/subsidiaryLedgerAccount.service";
import { AccountCategoryRepository } from "./Domain/accountCategory.repository";
import { AccountCategoryService } from "./Application/accountCategory.service";
import { JournalRepository } from "./Domain/journal.repository";
import { JournalFactory } from "./Domain/journal.factory";
import { JournalService } from "./Application/journal.service";
import { ChartOfAccountController } from "./Controllers/chartOfAccount.controller";
import { DetailAccountController } from "./Controllers/detailAccount.controller";
import { DimensionService } from "./Application/dimension.service";
import { DimensionRepository } from "./Domain/dimension.repository";
import { JournalController } from "./Controllers/journal.controller";
import { DimensionController } from "./Controllers/dimension.controller";

@Module( {
    providers : [
        DetailAccountService,
        DetailAccountRepository,
        GeneralLedgerAccountRepository,
        GeneralLedgerAccountService,
        SubsidiaryLedgerAccountRepository,
        SubsidiaryLedgerAccountService,
        AccountCategoryRepository,
        AccountCategoryService,
        JournalRepository,
        JournalFactory,
        JournalService,
        DimensionRepository,
        DimensionService
    ],
    controllers : [
        ChartOfAccountController,
        DetailAccountController,
        JournalController,
        DimensionController
    ]
} )
export class AccountingModule { }
