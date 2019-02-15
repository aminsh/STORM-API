"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../dist/Constants/enums'),
    Uuid = require('uuid-token-generator'),
    Enumerable = require('linq'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate(),
    toPascal = require('to-pascal-case');

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : ( r & 0x3 | 0x8 );
        return v.toString(16);
    });
}

exports.seed = async(function (knex, Promise) {
    let templates = await(knex.select('id', 'model').from('journalGenerationTemplates'));

    templates.forEach(item => {
        await(knex('journalGenerationTemplates').where({ id: item.id }).update({ model: toPascal(item.model) }))
    });

    let branches = await(knex.select('id').from('branches')),
        systemIOTypes = await(knex.select('*').from('inventoryIOTypes').whereNull('branchId'));

    branches.forEach(branch => {
        let ioTypes = systemIOTypes.map(io => ( {
            id: guid(),
            branchId: branch.id,
            title: io.title,
            type: io.type,
            key: io.id
        } ));

        await(knex('inventoryIOTypes').insert(ioTypes));

        let inventories = await(knex.select('*').from('inventories').where({ branchId: branch.id }));

        let inventoriesHasSystemIOType = Enumerable.from(ioTypes)
            .groupJoin(inventories,
                io => io.key,
                inventory => inventory.ioType,
                (io, inventories) => ( {
                    ioType: io,
                    inventories: inventories.toArray()
                } ))
            .toArray();

        inventoriesHasSystemIOType.forEach(item => {
            let ids = item.inventories.map(i => i.id);

            await(knex('inventories').whereIn('id', ids).update({ ioType: item.ioType.id }));
        });
    });

    await(knex('inventoryIOTypes').whereNull('branchId').del());

    let saleTemplate = await(knex.select('id', 'branchId').from('journalGenerationTemplates').where({ model: 'Sale' }));
    saleTemplate.forEach(tmp => {
        let type = {
            id: guid(),
            invoiceType: 'sale',
            title: 'فروش نقدی',
            journalGenerationTemplateId: tmp.id,
            isDefault: true,
            branchId: tmp.branchId
        };

        await(knex('invoice_types').insert(type));
    });

});

