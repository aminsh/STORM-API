import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/funds", "ShouldHaveBranch")
export class FundController {

    @inject("BankAndFundQuery")
    /**@type {BankAndFundQuery}*/bankAndFundQuery = undefined;

    @inject("FundService")
    /**@type {FundService}*/fundService = undefined;


    @Get("/")
    getAll(req) {

        return this.bankAndFundQuery.getAllByType('fund', req.query);
    }

    @Get("/:id")
    getById(req) {

        return this.bankAndFundQuery.getById(req.params.id);
    }

    @Post("/")
    create(req) {

        const id = this.fundService.create(req.body);

        return this.bankAndFundQuery.getById(id);
    }

    @Put("/:id")
    update(req) {

        const id = req.params.id;

        this.fundService.update(req.params.id, req.body);

        return this.bankAndFundQuery.getById(id);
    }

    @Delete("/:id")
    remove(req) {

        this.fundService.remove(req.params.id);
    }

}