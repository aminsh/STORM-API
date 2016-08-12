var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Repository = {
    findById: function (id) {
        return models.generalLedgerAccount.findOne(
            {
                where: {id: id},
                include: models.subsidiaryLedgerAccount
            });
    },
    findByCode: function (code, notEqualId) {
        var option = {where: {code: code}};
        if (notEqualId)
            option.where.id = {
                $ne: notEqualId
            };

        return db.generalLedgerAccount.findOne(option);
    },
    create: function (entity) {
        return db.generalLedgerAccount.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.generalLedgerAccount.findById(id));

        await(entity.destroy());
    })
};

module.exports = Repository;