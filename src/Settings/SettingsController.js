import {Controller, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {async} from "../Infrastructure/@decorators";
import {inject} from "inversify";

@Controller("/v1/settings", "ShouldHaveBranch")
export class SettingsController {

    @inject("SettingsQuery")
    /**@type {SettingsQuery}*/settingsQuery = undefined;

    @inject("SettingsService")
    /**@type {SettingService}*/settingsService = undefined;


    @Get("/")
    @async()
    get() {
        return this.settingsQuery.get()
    }

    @Post("/")
    @async()
    create() {
        this.settingsService.create();
    }

    @Put("/")
    @async()
    update(req) {

        this.settingsService.update(req.body);
    }

}