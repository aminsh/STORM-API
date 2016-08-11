var async = require('asyncawait/async');
var await = require('asyncawait/await');
var models = require('../models');

var create = async(function (cmd) {
    var entity = await(models.dimensionCategory.create({
        title: cmd.title,
    }));

    return {id: entity.id};
});

var update = async(function (cmd) {
    var entity = await(models.dimensionCategory.findById(cmd.id));

    entity.title = cmd.title;

    await(dimensionCategory.save());
});

var remove = async(function (cmd) {
    var enity = await(models.generalLedgerAccount.findById(cmd.id));

    await(enity.destroy());
});

module.exports = {
    create: create,
    update: update,
    remote: remove
};
