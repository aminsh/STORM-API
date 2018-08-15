import {Controller, Delete, Get, Post, Put} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/funds", "ShouldHaveBranch")
export class FundController {

    @inject("BankAndFundQuery")
    /**@type {BankAndFundQuery}*/bankAndFundQuery = undefined;

    @inject("FundService")
    /**@type {FundService}*/fundService = undefined;


    @Get("/")
    @async()
    getAll(req) {

        return this.bankAndFundQuery.getAllByType('fund', req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.bankAndFundQuery.getById(req.params.id);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.fundService.create(req.body);

        return this.bankAndFundQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {

        const id = req.params.id;

        this.fundService.update(req.params.id, req.body);

        return this.bankAndFundQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {

        this.fundService.remove(req.params.id);
    }

}