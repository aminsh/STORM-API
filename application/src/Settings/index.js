import {SettingsQuery} from "./SettingsQuery";
import {SettingService} from "./SettingsService";

import "./SettingsController";

export function register(container) {

    container.bind("SettingsQuery").to(SettingsQuery);
    container.bind("SettingsService").to(SettingService);
}