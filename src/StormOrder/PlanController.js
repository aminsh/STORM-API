import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/storm-plans")
class PlanController {

    @inject("PlanQuery")
    /** @type {PlanQuery}*/ planQuery = undefined;


    @Get("/")
    getAll() {

        return this.planQuery.find()
    }

    @Get("/:category")
    getAllByCategory(req) {

        return this.planQuery.find({category: req.params.category});
    }
}