import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";
import {async} from "../Infrastructure/@decorators";

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