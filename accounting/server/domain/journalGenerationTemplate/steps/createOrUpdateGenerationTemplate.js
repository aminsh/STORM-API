"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    JournalGenerationRepository = require('../../../data/repository.journalGenerationTemplate');

class CreateOrUpdateJournalGenerationTemplate {

    constructor(state, command) {

        this.journalGenerationRepository = new JournalGenerationRepository(state.branchId);

        this.command = command;
    }

    run() {
        const cmd = this.command,
            sourceType = cmd.sourceType,
            entity = {
                title: cmd.title,
                data: cmd.data
            };

        const isExits = await(this.journalGenerationRepository.findBySourceType(sourceType));

        if (isExits)
            await(this.journalGenerationRepository.update(sourceType, entity));
        else
            await(this.journalGenerationRepository.create(sourceType, entity));

        this.result = {
            id: entity.id
        };
    }
}

module.exports = CreateOrUpdateJournalGenerationTemplate;