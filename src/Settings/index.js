import {SettingsRepository} from "./SettingsRepository";
import {SettingsQuery} from "./SettingsQuery";
import {SettingService} from "./SettingsService";

import "./SettingsController";

export function register(container) {

    container.bind("SettingsRepository").to(SettingsRepository);
    container.bind("SettingsQuery").to(SettingsQuery);
    container.bind("SettingsService").to(SettingService);
}