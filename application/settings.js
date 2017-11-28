"use strict";

const SettingsRepository = require('./data').SettingsRepository;

class SettigsService {
    constructor(branchId) {
        this.branchId = branchId;

        this.settingsRespository = new SettingsRepository(branchId);
    }

    getEvent(module, event) {
        const settings = this.settingsRespository.get();

        if (!settings.events)
            return;

        if (settings.events.length === 0)
            return;

        return settings.events.asEnumerable()
            .singleOrDefault(e => e.module === module && e.event === event);
    }
}

module.exports = SettigsService;