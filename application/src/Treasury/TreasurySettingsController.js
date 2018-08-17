import {Controller, Get, Post, Put, Delete} from "../core/expressUtlis";
import {async} from "../core/@decorators";
import {inject} from "inversify";

@Controller("/v1/treasury/settings", "ShouldHaveBranch")
class TreasurySettingsController {

    @inject("TreasurySettingsService")
    /**@type{TreasurySettingsService}*/ treasurySettingService = undefined;

    @inject("TreasurySettingsQuery")
    /**@type{TreasurySettingsQuery}*/ treasurySettingsQuery = undefined;

    @Get("/")
    @async()
    get() {

        const result = this.treasurySettingsQuery.get();

        if (!result)
            this.treasurySettingService.create({
                journalGenerateAutomatic: false
            });

        return this.treasurySettingsQuery.get();
    }

    @Put("/")
    @async()
    update() {

        this.treasurySettingService.update(req.body);
    }
}