"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../dist/Constants/enums'),
    Uuid = require('uuid-token-generator'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate(),
    toPascal = require('to-pascal-case');

exports.seed = async(function (knex, Promise) {
    let templates = await(knex.select('id','model').from('journalGenerationTemplates'));

    templates.forEach(item => {
        await(knex('journalGenerationTemplates').where({id: item.id}).update({model: toPascal(item.model)}))
    });
});

