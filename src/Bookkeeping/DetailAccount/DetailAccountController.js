import {Controller, Delete, Get, Post, Put} from "../../Infrastructure/expressUtlis";
import {async} from "../../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/detail-accounts", "ShouldHaveBranch")
class DetailAccountController {

    @inject("DetailAccountQuery")
    /** @type{DetailAccountQuery}*/ detailAccountQuery = undefined;

    @inject("DetailAccountService")
    /** @type {DetailAccountService}*/ detailAccountService = undefined;

    @Get("/")
    @async()
    getAll(req) {
        return this.detailAccountQuery.getAll(req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {
        return this.detailAccountQuery.getById(req.params.id);
    }

    @Get("/by-subsidiary-ledger-account/:subsidiaryLedgerAccountId")
    getBySubsidiaryLedgerAccount(req){

        return this.detailAccountQuery.getAllBySubsidiryLedgerAccount(req.params.subsidiaryLedgerAccountId,req.query);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.detailAccountService.create(req.body);

        return this.detailAccountQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {

        this.detailAccountService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.detailAccountService.remove(req.params.id);
    }
}