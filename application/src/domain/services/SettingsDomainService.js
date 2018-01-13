import {inject, injectable} from "inversify";

@injectable()
export class SettingsDomainService {

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    getEvent(module, event) {
        const settings = this.settingsRepository.get();

        if (!settings.events)
            return;

        if (settings.events.length === 0)
            return;

        return settings.events.asEnumerable()
            .singleOrDefault(e => e.module === module && e.event === event);
    }
}