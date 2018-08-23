import {Controller, Get, Post, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/settings", "ShouldHaveBranch")
export class SettingsController {

    @inject("SettingsQuery")
    /**@type {SettingsQuery}*/settingsQuery = undefined;

    @inject("SettingsService")
    /**@type {SettingService}*/settingsService = undefined;


    @Get("/")
    get() {
        return this.settingsQuery.get()
    }

    @Post("/")
    create() {
        this.settingsService.create();
    }

    @Put("/")
    update(req) {

        this.settingsService.update(req.body);
    }

}