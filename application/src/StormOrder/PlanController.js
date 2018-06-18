import {Controller, Get} from "../core/expressUtlis";
import {inject} from "inversify";
import {async} from "../core/@decorators";

@Controller("/v1/storm-plans")
class PlanController {

    @inject("PlanQuery")
    /** @type {PlanQuery}*/ planQuery = undefined;


    @Get("/")
    @async()
    getAll() {

        return this.planQuery.find()
    }

    @Get("/:category")
    @async()
    getAllByCategory(req) {

        return this.planQuery.find({category: req.params.category});
    }
}