var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var subsidiaryLedgerAccountRepository = {
    findById: function (id) {
        return db.subsidiaryLedgerAccount.findOne({
            where: {
                id: id
            },
            include: [{
                model: db.generalLedgerAccount
            }]
        });
    },
    findByCode: function (code, generalLedgerAccountId, notEqualId) {
        var option = {
            where: {
                code: code
            },
            include: [{
                model: db.generalLedgerAccount,
                where: {id: generalLedgerAccountId}
            }]
        };

        if (notEqualId)
            option.where.id = {
                $ne: notEqualId
            };

        return db.subsidiaryLedgerAccount.findOne(option)
    },
    create: function (entity) {
        return db.subsidiaryLedgerAccount.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.subsidiaryLedgerAccount.findById(id));

        return entity.destroy();
    })
};

module.exports = subsidiaryLedgerAccountRepository;

