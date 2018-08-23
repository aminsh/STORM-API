import {Controller, Get, Post, Delete} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/third-party", "ShouldHaveBranch")
class ThirdPartyController {


    @inject("ThirdPartyQuery")
    /** @type {ThirdPartyQuery} */ thirdPartyQuery = undefined;

    @inject("RegisteredThirdPartyService")
    /** @type{RegisteredThirdPartyService}*/ registeredThirdPartyService = undefined;

    @Get("/")
    getAll() {

        return this.thirdPartyQuery.getAll();
    }

    @Post("/:key")
    create(req) {

        this.registeredThirdPartyService.create(req.params.key, req.body);
    }

    @Delete("/:key")
    remove(req) {

        this.registeredThirdPartyService.remove(req.params.key);
    }
}