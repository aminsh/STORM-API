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
        return db.journal.findById(id);
    },
    maxTemporaryNumber: function (periodId) {
        return db.journal.max('temporaryNumber', {
            include: [
                {model: 'period', where: {id: periodId}}
            ]
        });
    },
    create: function (entity) {
        return db.journal.create(entity);
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