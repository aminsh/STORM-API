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
    /*    let templates = await(knex.select('id', 'model').from('journalGenerationTemplates'));

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

        let salesHasJournals = await(
            knex.select('journalId').from('invoices')
                .whereIn('invoiceType', [ 'sale', 'returnSale' ])
                .whereNotNull('journalId')
        );

        await(knex('journals')
            .whereIn('id', salesHasJournals.map(item => item.journalId))
            .update({ issuer: 'Sale' })
        );

        let purchaseHasJournals = await(
            knex.select('journalId').from('invoices')
                .whereIn('invoiceType', [ 'purchase', 'returnPurchase' ])
                .whereNotNull('journalId')
        );

        await(knex('journals')
            .whereIn('id', purchaseHasJournals.map(item => item.journalId))
            .update({ issuer: 'Purchase' })
        );


        let InventoriesHasJournals = await(
            knex.select('journalId').from('inventories').whereNotNull('journalId')
        );

        await(knex('journals')
            .whereIn('id', InventoriesHasJournals.map(item => item.journalId))
            .update({ issuer: 'Inventory' })
        );

        let treasuryHasJournal = await(
            knex.select('journalId').from('treasury').whereNotNull('journalId')
        );

        await(knex('journals')
            .whereIn('id', treasuryHasJournal.map(item => item.journalId))
            .update({ issuer: 'Treasury' })
        );*/

    await(
        knex('currency').insert([ { "id": "USD", "title": "دلار آمريکا" }, {
            "id": "GBP",
            "title": "پوند انگليس"
        }, { "id": "CHF", "title": "فرانک سويس" }, { "id": "SEK", "title": "کرون سوئد" }, {
            "id": "NOK",
            "title": "کرون نروژ"
        }, { "id": "DKK", "title": "کرون دانمارک" }, { "id": "INR", "title": "روپيه هند" }, {
            "id": "AED",
            "title": "درهم امارات متحده عربی"
        }, { "id": "KWD", "title": "دينار کويت" }, { "id": "PKR", "title": " روپيه پاکستان" }, {
            "id": "JPY",
            "title": "ين ژاپن"
        }, { "id": "HKD", "title": "دلار هنگ کنگ" }, { "id": "OMR", "title": "ريال عمان" }, {
            "id": "CAD",
            "title": "دلار کانادا"
        }, { "id": "NZD", "title": "دلار نيوزيلند" }, { "id": "ZAR", "title": "راند آفريقای جنوبی" }, {
            "id": "TRY",
            "title": "لير ترکيه"
        }, { "id": "RUB", "title": "روبل روسيه" }, { "id": "QAR", "title": "ريال قطر" }, {
            "id": "IQD",
            "title": " دينار عراق"
        }, { "id": "SYP", "title": "لير سوريه" }, { "id": "AUD", "title": "دلار استراليا" }, {
            "id": "SAR",
            "title": "ريال سعودی"
        }, { "id": "BHD", "title": "دينار بحرين" }, { "id": "SGD", "title": "دلار سنگاپور" }, {
            "id": "BDT",
            "title": " تاکای بنگلادش"
        }, { "id": "LKR10", "title": "ده روپيه سريلانکا" }, {
            "id": "MMK",
            "title": "کيات ميانمار (برمه)"
        }, { "id": "NPR", "title": " روپيه نپال" }, { "id": "AMD", "title": " درام ارمنستان" }, {
            "id": "LYD",
            "title": "دينار ليبی"
        }, { "id": "CNY", "title": "یوان چين" }, { "id": "THB", "title": " بات تايلند" }, {
            "id": "MYR",
            "title": "رينگيت مالزی"
        }, { "id": "KRW", "title": " وون کره جنوبی" }, { "id": "JOD", "title": "دينار اردن" }, {
            "id": "EUR",
            "title": "یورو"
        }, { "id": "KZT", "title": " تنگه قزاقستان" }, { "id": "GEL", "title": "لاری گرجستان" }, {
            "id": "IDR",
            "title": " روپیه اندونزی"
        }, { "id": "AFN", "title": "افغانی افغانستان" }, { "id": "BYN", "title": "روبل جديد بلاروس" }, {
            "id": "AZN",
            "title": "منات آذربايجان"
        }, { "id": "PHP", "title": " پزوی فيليپين" }, { "id": "TJS", "title": "سومونی تاجيکستان" }, {
            "id": "VEF",
            "title": "بوليوار جديد ونزوئلا"
        }, { "id": "TMT", "title": "منات جدید ترکمنستان" } ])
    );

});

