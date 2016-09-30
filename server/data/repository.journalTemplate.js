var db = require('../models');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var Repository = {
    findById: function (id) {
        return db.journalTemplate.findById(id);
    },
    create: function (entity) {
        return db.journalTemplate.create(entity);
    },
    remove: async(function (id) {
        var entity = await(db.journalTemplate.findById(id));

        await(entity.destroy());
    })
};

module.exports = Repository;

