import {Controller, Get} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1")
class ConstantsController {

    @inject("Enums") enums = undefined;

    @Get("/enums")
    getEnums() {
        let enums = this.enums;

        return Object.keys(enums).asEnumerable()
            .select(key => ({key, value: enums[key]().data}))
            .toObject(item => item.key, item => item.value);
    }
}