import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/chart-of-accounts", "ShouldHaveBranch")
class ChartOfAccountController {

    @inject("ChartOfAccountQuery")
    /** @type{ChartOfAccountQuery}*/ chartOfAccountQuery = undefined;

    @inject("AccountCategoryService")
    /** @type{AccountCategoryService}*/ accountCategoryService = undefined;

    @inject("GeneralLedgerAccountService")
    /** @type{GeneralLedgerAccountService}*/ generalLedgerAccountService = undefined;

    @inject("SubsidiaryLedgerAccountService")
    /** @type{SubsidiaryLedgerAccountService}*/ subsidiaryLedgerAccountService = undefined;

    @Get("/")
    getAll() {

        return this.chartOfAccountQuery.chartOfAccount();
    }

    @Get("/categories")
    categories() {

        return this.chartOfAccountQuery.accountCategory();
    }

    @Post("/category")
    createCategory(req) {

        this.accountCategoryService.create(req.body);
    }

    @Put("/category/:id")
    updateCategory(req) {

        this.accountCategoryService.update(req.params.id, req.body);
    }

    @Delete("/category/:id")
    removeCategory(req) {

        this.accountCategoryService.remove(req.params.id);
    }

    @Get("/general-ledger-accounts")
    getAllGeneralLedgerAccounts(req) {

        return this.chartOfAccountQuery.generalLedgerAccounts(req.query);
    }

    @Post("/general-ledger-accounts")
    createGeneralLedgerAccount(req) {
        this.generalLedgerAccountService.create(req.body);
    }

    @Get("/general-ledger-accounts/:id")
    generalLedgerAccountGetById(req) {

        return this.chartOfAccountQuery.generalLedgerAccountGetById(req.params.id);
    }

    @Put("/general-ledger-accounts/:id")
    updateGeneralLedgerAccount(req) {
        this.generalLedgerAccountService.update(req.params.id, req.body);
    }

    @Delete("/general-ledger-accounts/:id")
    removeGeneralLedgerAccount(req) {
        this.generalLedgerAccountService.remove(req.params.id);
    }

    @Post("/subsidiary-ledger-accounts/:generalLedgerAccountId")
    createSubsidiaryLedgerAccount(req) {

        this.subsidiaryLedgerAccountService.create(req.params.generalLedgerAccountId, req.body);
    }

    @Get("/subsidiary-ledger-accounts/:id")
    subsidiaryLedgerAccountById(req) {

        return this.chartOfAccountQuery.subsidiaryLedgerAccountById(req.params.id);
    }

    @Put("/subsidiary-ledger-accounts/:id")
    updateSubsidiaryLedgerAccount(req) {

        this.subsidiaryLedgerAccountService.update(req.params.id, req.body);
    }

    @Delete("/subsidiary-ledger-accounts/:id")
    removeSubsidiaryLedgerAccount(req) {

        this.subsidiaryLedgerAccountService.remove(req.params.id);
    }
}