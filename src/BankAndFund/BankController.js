import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/banks", "ShouldHaveBranch")
export class BankController {

    @inject("BankAndFundQuery")
    /**@type {BankAndFundQuery}*/bankAndFundQuery = undefined;

    @inject("BankService")
    /**@type {BankService}*/bankService = undefined;


    @Get("/")
    @async()
    getAll(req) {

        return this.bankAndFundQuery.getAllByType('bank', req.query);
    }

    @Get("/:id")
    @async()
    getById(req) {

        return this.bankAndFundQuery.getById(req.params.id);
    }

    @Post("/")
    @async()
    create(req) {

        const id = this.bankService.create(req.body);

        return this.bankAndFundQuery.getById(id);
    }

    @Put("/:id")
    @async()
    update(req) {

        const id = req.params.id;

        this.bankService.update(req.params.id, req.body);

        return this.bankAndFundQuery.getById(id);
    }

    @Delete("/:id")
    @async()
    remove(req) {
        
        this.bankService.remove(req.params.id);
    }

}