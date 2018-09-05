import {Controller, Get, Put} from "../Infrastructure/expressUtlis";
import {inject} from "inversify";

@Controller("/v1/treasury/settings", "ShouldHaveBranch")
class TreasurySettingsController {

    @inject("TreasurySettingsService")
    /**@type{TreasurySettingsService}*/ treasurySettingService = undefined;

    @inject("TreasurySettingsQuery")
    /**@type{TreasurySettingsQuery}*/ treasurySettingsQuery = undefined;

    @Get("/")
    get() {

        const result = this.treasurySettingsQuery.get();

        if (!result)
            this.treasurySettingService.create({
                journalGenerateAutomatic: false
            });

        return this.treasurySettingsQuery.get();
    }

    @Put("/")
    update() {

        this.treasurySettingService.update(req.body);
    }
}