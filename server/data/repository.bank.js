var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Repository = {
    findById: function (id) {
        return db.bank.findById(id);
    },
    create: function (entity) {
        return db.bank.create(entity);
    },
    update: function (entity) {
        return entity.save();
    },
    remove: async(function (id) {
        var entity = await(db.bank.findById(id));

        await(entity.destroy());
    })
};

module.exports = Repository;

