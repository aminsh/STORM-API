var async = require('asyncawait/async');
var await = require('asyncawait/await');
var models = require('../models');


var create = async(function (cmd) {
    var createdGeneralLedgerAccount = await(models.generalLedgerAccount.create({
        code: cmd.code,
        title: cmd.title,
        postingType: cmd.postingType,
        balanceType: cmd.balanceType,
        description: cmd.description,
        isActive: true
    }));

    return {id: createdGeneralLedgerAccount.id};
});

var update = async(function (cmd) {
    var generalLedgerAccount = await(models.generalLedgerAccount.findById(cmd.id));

    generalLedgerAccount.title = cmd.title;
    generalLedgerAccount.code = cmd.code;
    generalLedgerAccount.potingType = cmd.postingType;
    generalLedgerAccount.balanceType = cmd.balanceType;
    generalLedgerAccount.description = cmd.description;

    await(generalLedgerAccount.save());
});

var remove = async(function (cmd) {
    var generalLedgerAccount = await(models.generalLedgerAccount.findById(cmd.id));

    await(generalLedgerAccount.destroy());
});

var activate = async(function (cmd) {
    var generalLedgerAccount = await(models.generalLedgerAccount.findById(cmd.id));

    generalLedgerAccount.isActive = true;

    await(generalLedgerAccount.save());
});

var deactivate = async(function (cmd) {
    var generalLedgerAccount = await(models.generalLedgerAccount.findById(cmd.id));

    generalLedgerAccount.isActive = false;

    await(generalLedgerAccount.save());
});

module.exports = {
    create: create,
    update: update,
    remote: remove,
    activate: activate,
    deactivate: deactivate
}