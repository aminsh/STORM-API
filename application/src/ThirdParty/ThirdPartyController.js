import {Controller, Get, Post, Delete} from "../core/expressUtlis";
import {inject} from "inversify";
import {async} from "../core/@decorators";

@Controller("/v1/third-party", "ShouldHaveBranch")
class ThirdPartyController {


    @inject("ThirdPartyQuery")
    /** @type {ThirdPartyQuery} */ thirdPartyQuery = undefined;

    @inject("RegisteredThirdPartyService")
    /** @type{RegisteredThirdPartyService}*/ registeredThirdPartyService = undefined;

    @Get("/")
    @async()
    getAll() {

        return this.thirdPartyQuery.getAll();
    }

    @Post("/:key")
    @async()
    create(req) {

        this.registeredThirdPartyService.create(req.params.key, req.body);
    }

    @Delete("/:key")
    @async()
    remove(req) {

        this.registeredThirdPartyService.remove(req.params.key);
    }
}