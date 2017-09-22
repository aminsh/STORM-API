"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../../../data/repository.inventory'),
    SettingRepository = require('../../../data/repository.setting');

class CreateOutputOnSale {

    constructor(branchId, fiscalPeriodId) {

        const settingRepository = new SettingRepository(branchId);

        this.settings = await(settingRepository.get());

        this.inventoryRepository = new InventoryRepository(branchId);

        this.createOutputBySale = instanceOf('createOutput', { branchId, fiscalPeriodId, settings: this.settings });
        
    }

    run(cmd) {
        let output = this.createOutputBySale.set(cmd);

        await(this.inventoryRepository.create(output));

        if (Array.isArray(output))
            this.result = {
                ids: output.asEnumerable()
                    .select(item => item.id)
                    .toArray()
            };
        else
            this.result = {id: output.id};
    }
}

module.exports = CreateOutputOnSale;