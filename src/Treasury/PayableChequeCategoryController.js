import {Controller, Delete, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/cheque-categories", "ShouldHaveBranch")
class PayableChequeCategoryController {

    @inject("PayableChequeCategoryQuery")
    /**@type{PayableChequeCategoryQuery}*/ payableChequeCategoryQuery = undefined;

    @inject("PayableChequeCategoryService")
    /**@type{PayableChequeCategoryService}*/ payableChequeCategoryService = undefined;

    @Get("/")
    getAll(req) {

        return this.payableChequeCategoryQuery.getAll(req.query);
    }

    @Get("/:bankId/cheque-number")
    getCheque(req) {

        return this.payableChequeCategoryQuery.getCheque(req.params.bankId);
    }

    @Get("/:id")
    getById(req) {

        return this.payableChequeCategoryQuery.getById(req.params.id);
    }

    @Get("/:id/cheques")
    getAllCheques(req) {

        return this.payableChequeCategoryQuery.getAllCheques(req.params.id);
    }

    @Post("/")
    create(req) {

        this.payableChequeCategoryService.create(req.body);
    }

    @Put("/:id")
    update(req) {

        this.payableChequeCategoryService.update(req.params.id, req.body);
    }

    @Delete("/:id")
    remove(req) {

        this.payableChequeCategoryService.remove(req.params.id);
    }
}