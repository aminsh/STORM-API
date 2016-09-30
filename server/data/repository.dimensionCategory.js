var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var generalLedgerAccountRepository = {
    findById: function (id) {
        return models.dimensionCategory.findById(id);
    },
    create: function (entity) {
        return db.dimensionCategory.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.dimensionCategory.findById(id));

        await(entity.destroy());
    })
};

module.exports = generalLedgerAccountRepository;
