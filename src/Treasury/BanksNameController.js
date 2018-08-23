import {Controller, Get, Post} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/banks-name", "ShouldHaveBranch")
class BanksNameController {

    @inject("BanksNameQuery")
    /** @type {BanksNameQuery}*/ banksNameQuery = undefined;

    @inject("BanksNameService")
    /** @type {BanksNameService}*/ banksNameService = undefined;

    @Get("/")
    getAll(req){

        return this.banksNameQuery.getAll(req.query);
    }

    @Post("/")
    create(req){

        const id = this.banksNameService.create(req.body);

        return this.banksNameQuery.getById(id);
    }

}