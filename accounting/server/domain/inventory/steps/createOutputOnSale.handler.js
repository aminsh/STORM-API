"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../../../data/repository.inventory'),
    SettingRepository = require('../../../data/repository.setting');

class CreateOutputOnSale {

    constructor(state, command) {

        const settingRepository = new SettingRepository(state.branchId);

        this.settings = await(settingRepository.get());

        this.inventoryRepository = new InventoryRepository(state.branchId);

        this.createOutputBySale = instanceOf('createOutput', state.branchId, state.fiscalPeriodId, this.settings);

        this.command = command;

    }

    run() {
        const cmd = this.command;

        let output = this.createOutputBySale.set(cmd);

        await(this.inventoryRepository.create(output));

        if (Array.isArray(output))
            this.result = {
                ids: output.asEnumerable()
                    .select(item => item.id)
                    .toArray()
            };
        else
            this.result = {id: output.id, number: output.number};
    }
}

module.exports = CreateOutputOnSale;