var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Repository = {
    findById: function (id) {
        return db.detailAccount.findById(id);
    },
    findByCode: function (code, notEqualId) {
        var option = {where: {code: code}};
        if (notEqualId)
            option.where.id = {
                $ne: notEqualId
            };

        return db.detailAccount.findOne(option);
    },
    create: function (entity) {
        return db.detailAccount.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.detailAccount.findById(id));

        await(entity.destroy());
    })
};

module.exports = Repository;
