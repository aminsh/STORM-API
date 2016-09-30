var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var journalRepository = {
    findByTemporaryNumber: function (number, periodId) {
        return db.journal.findone({
            where: {
                temporaryNumber: number
            },
            include: [
                {model: 'period', where: {id: periodId}}
            ]
        });
    },
    findById: function (id) {
        return db.journal.findOne({
            where: {
                id: id
            },
            include: [
                {model: db.journalLine}
            ]
        });
    },
    maxTemporaryNumber: function (periodId) {
        return db.journal.max('temporaryNumber', {
            where: {
                periodId: periodId
            }
        });
    },
    create: function (entity) {
        var option = {};

        if (entity.journalLines && entity.journalLines.length > 0)
            option.include = [db.journalLine];

        return db.journal.create(entity, option);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.journal.findById(id));
        return entity.destroy();
    })
};

module.exports = journalRepository;