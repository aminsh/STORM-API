import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/detail-accounts", "ShouldHaveBranch")
class DetailAccountController {

    @inject("DetailAccountQuery")
    /** @type{DetailAccountQuery}*/ detailAccountQuery = undefined;

    @inject("DetailAccountService")
    /** @type {DetailAccountService}*/ detailAccountService = undefined;

    @Get("/")
    getAll(req) {
        return this.detailAccountQuery.getAll(req.query);
    }

    @Get("/:id")
    getById(req) {
        return this.detailAccountQuery.getById(req.params.id);
    }

    @Get("/by-subsidiary-ledger-account/:subsidiaryLedgerAccountId")
    getBySubsidiaryLedgerAccount(req){

        return this.detailAccountQuery.getAllBySubsidiryLedgerAccount(req.params.subsidiaryLedgerAccountId,req.query);
    }

    @Post("/")
    create(req) {

        const id = this.detailAccountService.create(req.body);

        return this.detailAccountQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        this.detailAccountService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    remove(req) {

        this.detailAccountService.remove(req.params.id);
    }
}