import {Controller, Delete, Get, Post, Put} from "../../core/expressUtlis";
import {async} from "../../core/@decorators";
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
    @async()
    getAll() {

        return this.chartOfAccountQuery.chartOfAccount();
    }

    @Post("/category")
    @async()
    createCategory(req) {

        this.accountCategoryService.create(req.body);
    }

    @Put("/category/:id")
    @async()
    updateCategory(req) {

        this.accountCategoryService.update(req.params.id, req.body);
    }

    @Delete("/category/:id")
    @async()
    removeCategory(req) {

        this.accountCategoryService.remove(req.params.id);
    }

    @Get("/general-ledger-accounts")
    @async()
    getAllGeneralLedgerAccounts(req) {

        return this.chartOfAccountQuery.generalLedgerAccounts(req.query);
    }

    @Post("/general-ledger-accounts")
    @async()
    createGeneralLedgerAccount(req) {
        this.generalLedgerAccountService.create(req.body);
    }

    @Put("/general-ledger-accounts/:id")
    @async()
    updateGeneralLedgerAccount(req) {
        this.generalLedgerAccountService.update(req.params.id, req.body);
    }

    @Delete("/general-ledger-accounts/:id")
    @async()
    removeGeneralLedgerAccount(req) {
        this.generalLedgerAccountService.remove(req.params.id);
    }

    @Post("/subsidiary-ledger-accounts/:generalLedgerAccountId")
    @async()
    createSubsidiaryLedgerAccount(req) {

        this.subsidiaryLedgerAccountService.create(req.params.generalLedgerAccountId, req.body);
    }

    @Put("/subsidiary-ledger-accounts/:id")
    @async()
    updateSubsidiaryLedgerAccount(req) {

        this.subsidiaryLedgerAccountService.update(req.params.id, req.body);
    }

    @Delete("/subsidiary-ledger-accounts/:id")
    @async()
    removeSubsidiaryLedgerAccount(req) {

        this.subsidiaryLedgerAccountService.remove(req.params.id);
    }
}