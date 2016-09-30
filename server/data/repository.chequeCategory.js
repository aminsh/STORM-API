var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Repository = {
    findById: function (id) {
        return db.chequeCategory.findById(id);
    },
    create: async(function (entity, cheques) {
        var entity = await(db.chequeCategory.create(entity, {include: [db.cheque]}));
        return entity;
    }),
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.bank.findById(id));

        await(entity.destroy());
    })
};

module.exports = Repository;


