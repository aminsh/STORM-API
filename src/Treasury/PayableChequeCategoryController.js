import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/cheque-categories", "ShouldHaveBranch")
class PayableChequeCategoryController {

    @inject("PayableChequeCategoryQuery")
    /**@type{PayableChequeCategoryQuery}*/ payableChequeCategoryQuery = undefined;

    @inject("PayableChequeCategoryService")
    /**@type{PayableChequeCategoryService}*/ payableChequeCategoryService = undefined;

    @Get("/")
    @async()
    getAll(req){

        return this.payableChequeCategoryQuery.getAll(req.query);
    }

    @Get("/:bankId/cheque-number")
    @async()
    getCheque(req){

        return this.payableChequeCategoryQuery.getCheque(req.params.bankId);
    }

    @Get("/")
    @async()
    getById(req){

        return this.payableChequeCategoryQuery.getById(req.params.id);
    }

    @Get("/:id/cheques")
    @async()
    getAllCheques(req){

        return this.payableChequeCategoryQuery.getAllCheques(req.params.id);
    }

    @Post("/")
    @async()
    create(req){

        this.payableChequeCategoryService.create(req.body);
    }

    @Put("/:id")
    @async()
    update(req){

        this.payableChequeCategoryService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    @async()
    remove(req){

        this.payableChequeCategoryService.remove(req.params.id);
    }
}