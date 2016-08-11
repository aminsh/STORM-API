var async = require('asyncawait/async');
var await = require('asyncawait/await');
var persianDateSerivce = require('../services/persianDateService');
var journalRepository = require('../data/journalsRepository');

var create = async(function (cmd, current) {
    var entity = {
        periodId: current.periodId,
        createdById: current.userId,
        journalStatus: 'Temporary',
        temporaryNumber: (await(journalRepository.maxTemporaryNumber(current.periodId)) || 0) + 1,
        temporaryDate: cmd.temporaryDate || persianDateSerivce.current(),
        description: cmd.description
    };

    var journal = await(journalRepository.create(entity));

    return {id: journal.id};
});

var update = async(function (cmd) {
    var entity = await(journalRepository.findById(cmd.id));

    entity.temporaryNumber = cmd.temporaryNumber || entity.temporaryNumber;
    entity.temporaryDate = cmd.temporaryDate || entity.temporaryDate;
    entity.description = cmd.description;

    await(journalRepository.update(entity));

});

var remove = async(function (cmd) {
    var entity = await(journalRepository.findById(cmd.id));

    await(journalRepository.remove(entity));
});

var bookkeep = async(function (cmd) {
    var entity = await(journalRepository.findById(cmd.id));

    entity.journalStatus = 'BookKeeped';

    await(journalRepository.update(entity));
});

var fix = async(function (cmd) {
    var entity = await(journalRepository.findById(cmd.id));

    entity.journalStatus = 'Fixed';

    await(journalRepository.update(entity));
});

module.exports = {
    create: create,
    update: update,
    remove: remove,
    bookkeep: bookkeep,
    fix: fix
}
