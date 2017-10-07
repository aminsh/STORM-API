"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),

    WorkflowBase = require('../../workFlowBase'),
    EventEmitter = instanceOf('EventEmitter'),

    CreateSaleValidator = require('../steps/createSale.validator'),
    CreateSaleHandler = require('../steps/createSale.handler'),
    CreateJournalOnSaleHandler = require('../../journal/steps/createJournal.onSale.handler'),
    CreateOutputOnSaleHandler = require('../../inventory/steps/createOutputOnSale.handler'),
    CreateJournalOnOutputHandler = require('../../journal/steps/createJournal.onInventoryOutput.handler'),

    SettingsRepository = require('../../../data/repository.setting'),

    ProductDomain = require('../../product');


class CreateSaleWorkflow extends WorkflowBase {

    constructor(state, data) {
        super(state, data);

        this.name = 'create-sale';
        this.version = 1;

        this.productDomain = new ProductDomain(state.branchId);

        const settingsRepository = new SettingsRepository(state.branchId);
        state.settings = await(settingsRepository.get());
    }


    build() {

        this
            .startWith({handler: CreateSaleValidator, input: data => data})
            .then({
                handler: CreateSaleHandler,
                input: data => data,
                output: (data, result) => Object.assign(data, result)
            })
            .then({
                handler: (state, data) => EventEmitter.emit(this.id, null, data),

                input: data => ({id: data.id, printUrl: data.printUrl})
            })

            /*
            * Journal creation
            */
            .then({
                canExecute: state => state.settings.canSaleGenerateAutomaticJournal,
                handler: CreateJournalOnSaleHandler,
                input: data => data
            })

            /*
            * Inventory Output creation
            */
            .then({
                canExecute: (state, data) => {

                    if (!state.settings.canControlInventory)
                        return false;

                    return data.invoiceLines.asEnumerable()
                        .any(async.result(item => await(this.productDomain.isGood(item.productId))));

                },
                handler: CreateOutputOnSaleHandler,
                input: data => ({
                    id: data.id,
                    number: data.number,
                    date: data.date,
                    invoiceLines: data.invoiceLines.asEnumerable()
                        .where(async.result(item => await(this.productDomain.isGood(item.productId))))
                        .toArray()
                }),
                output: (data, result) => Object.assign(data, {outputId: result.id})
            })

            /*
            * Journal output creation
            */

            .then({
                canExecute: (state, data) => data.outputId,
                handler: CreateJournalOnOutputHandler,
                input: data => ({id: data.outputId})
            })

            .onError(e => {
                EventEmitter.emit(this.id, e)
            });
    }
}

module.exports = CreateSaleWorkflow;